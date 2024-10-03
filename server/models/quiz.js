const { ObjectId } = require('mongodb');

class Quiz {

    constructor(db) {
        // console.log("Quiz constructor: db", db)
        this.db = db;
    }

    async create(title, content, folderId, userId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const existingQuiz = await quizCollection.findOne({ title: title, folderId: folderId, userId: userId })

        if (existingQuiz) return null;

        const newQuiz = {
            folderId: folderId,
            userId: userId,
            title: title,
            content: content,
            created_at: new Date(),
            updated_at: new Date()
        }

        const result = await quizCollection.insertOne(newQuiz);

        return result.insertedId;
    }

    async getOwner(quizId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const quiz = await quizCollection.findOne({ _id: ObjectId.createFromHexString(quizId) });

        return quiz.userId;
    }

    async getContent(quizId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const quiz = await quizCollection.findOne({ _id: ObjectId.createFromHexString(quizId) });

        return quiz;
    }

    async delete(quizId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const result = await quizCollection.deleteOne({ _id: ObjectId.createFromHexString(quizId) });

        if (result.deletedCount != 1) return false;

        return true;
    }
    async deleteQuizzesByFolderId(folderId) {
        await this.db.connect();
        const conn = this.db.getConnection();

        const quizzesCollection = conn.collection('files');

        // Delete all quizzes with the specified folderId
        const result = await quizzesCollection.deleteMany({ folderId: folderId });
        return result.deletedCount > 0;
    }

    async update(quizId, newTitle, newContent) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const result = await quizCollection.updateOne(
            { _id: ObjectId.createFromHexString(quizId) },
            { 
                $set: {
                    title: newTitle, 
                    content: newContent, 
                    updated_at: new Date() 
                } 
            }
        );

        return result.modifiedCount === 1;
    }

    async move(quizId, newFolderId) {
        await this.db.connect()
        const conn = this.db.getConnection();

        const quizCollection = conn.collection('files');

        const result = await quizCollection.updateOne(
            { _id: ObjectId.createFromHexString(quizId) }, 
            { $set: { folderId: newFolderId } }
        );

        if (result.modifiedCount != 1) return false;

        return true
    }

    async duplicate(quizId, userId) {
        
        const sourceQuiz = await this.getContent(quizId);
        if (!sourceQuiz) {
            throw new Error('Quiz not found for quizId: ' + quizId);
        }
        
        // detect if quiz name ends with a number in parentheses
        // if so, increment the number and append to the new quiz name
        let newQuizTitle;
        let counter = 1;

        if (sourceQuiz.title.match(/\(\d+\)$/)) {
            const parts = sourceQuiz.title.split(' (');
            parts[1] = parts[1].replace(')', '');
            counter = parseInt(parts[1]) + 1;
            newQuizTitle = `${parts[0]} (${counter})`;
        } else {
            newQuizTitle = `${sourceQuiz.title} (1)`;
        }

        // Need to make sure no quiz exists with the new name, otherwise increment the counter until a unique name is found
        while (await this.quizExists(newQuizTitle, userId)) {
            counter++;
            // take off the last number in parentheses and add it back with the new counter
            newQuizTitle = newQuizTitle.replace(/\(\d+\)$/, `(${counter})`);
        }

        const newQuizId = await this.create(newQuizTitle, sourceQuiz.content,sourceQuiz.folderId, userId);

        if (!newQuizId) {
            throw new Error('Failed to create a duplicate quiz.');
        }

        return newQuizId;

    }

    async quizExists(title, userId) {
        await this.db.connect();
        const conn = this.db.getConnection();
    
        const filesCollection = conn.collection('files');           
        const existingFolder = await filesCollection.findOne({ title: title, userId: userId });        
        
        return existingFolder !== null;
    }

}

module.exports = Quiz;
