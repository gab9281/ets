//model
// const db = require('../config/db.js')
const ObjectId = require('mongodb').ObjectId;
// need to access the Quiz model from the Folders model

class Folders {
    constructor(db, quizModel) {
        this.db = db;
        this.quizModel = quizModel;
    }

    async create(title, userId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const existingFolder = await foldersCollection.findOne({ title: title, userId: userId });

        if (existingFolder) return new Error('Folder already exists');

        const newFolder = {
            userId: userId,
            title: title,
            created_at: new Date()
        }

        const result = await foldersCollection.insertOne(newFolder);

        return result.insertedId;
    }

    async getUserFolders(userId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const result = await foldersCollection.find({ userId: userId }).toArray();

        return result;
    }

    async getOwner(folderId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const folder = await foldersCollection.findOne({ _id: new ObjectId(folderId) });

        return folder.userId;
    }

    async getContent(folderId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const filesCollection = conn.collection('files');

        const result = await filesCollection.find({ folderId: folderId }).toArray();

        return result;
    }

    async delete(folderId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const folderResult = await foldersCollection.deleteOne({ _id: new ObjectId(folderId) });

        if (folderResult.deletedCount != 1) return false;
        await Quiz.deleteQuizzesByFolderId(folderId);

        return true;
    }

    async rename(folderId, newTitle) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const result = await foldersCollection.updateOne({ _id: new ObjectId(folderId) }, { $set: { title: newTitle } })

        if (result.modifiedCount != 1) return false;

        return true
    }

    async duplicate(folderId, userId) {

        const sourceFolder = await this.getFolderWithContent(folderId);

        // Check if the new title already exists
        let newFolderTitle = sourceFolder.title + "-copie";
        let counter = 1;
        
        while (await this.folderExists(newFolderTitle, userId)) {
            newFolderTitle = `${sourceFolder.title}-copie(${counter})`;
            counter++;
        }
        
        
        const newFolderId = await this.create(newFolderTitle, userId);

        if (!newFolderId) {
            throw new Error('Failed to create a duplicate folder.');
        }

        for (const quiz of sourceFolder.content) {            
            const { title, content } = quiz;
            //console.log(title);
            //console.log(content);
            await Quiz.create(title, content, newFolderId.toString(), userId); 
        }

        return newFolderId;

    }

    async folderExists(title, userId) {
        console.log("LOG: folderExists", title, userId);
        await this.db.connect();
        const conn = this.db.getConnection();
    
        const foldersCollection = conn.collection('folders');           
        const existingFolder = await foldersCollection.findOne({ title: title, userId: userId });        
        
        return !!existingFolder;
    }


    async copy(folderId, userId) {

        const sourceFolder = await this.getFolderWithContent(folderId);
        const newFolderId = await this.create(sourceFolder.title, userId);
        if (!newFolderId) {
            throw new Error('Failed to create a new folder.');
        }
        for (const quiz of sourceFolder.content) {
            await Quiz.create(quiz.title, quiz.content, newFolderId, userId);
        }

        return newFolderId;
    }

    async getFolderById(folderId) {
        await this.db.connect();
        const conn = this.db.getConnection();

        const foldersCollection = conn.collection('folders');

        const folder = await foldersCollection.findOne({ _id: new ObjectId(folderId) });

        if (!folder) return new Error(`Folder ${folderId} not found`);

        return folder;
    }


    async getFolderWithContent(folderId) {

       
        const folder = await this.getFolderById(folderId);

        const content = await this.getContent(folderId);
       
        return {
            ...folder,
            content: content
        };

    }

}

module.exports = Folders;
