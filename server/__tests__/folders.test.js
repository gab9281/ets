const Folders = require('../models/folders');
const ObjectId = require('mongodb').ObjectId;
const Quizzes = require('../models/quiz');

describe('Folders', () => {
    let folders;
    let db;
    let collection;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock calls

        // Mock the collection object
        collection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
            find: jest.fn().mockReturnValue({ toArray: jest.fn() }), // Mock the find method
        };

        // Mock the database connection
        db = {
            connect: jest.fn(),
            getConnection: jest.fn().mockReturnThis(), // Add getConnection method
            collection: jest.fn().mockReturnValue(collection),
        };

        quizzes = new Quizzes(db);
        folders = new Folders(db, quizzes);

    });

    describe('folderExists', () => {
        it('should return true if folder exists', async () => {
            const title = 'Test Folder';
            const userId = '12345';

            // Mock the database response
            collection.findOne.mockResolvedValue({ title, userId });

            // Spy on console.log
            const consoleSpy = jest.spyOn(console, 'log');

            const result = await folders.folderExists(title, userId);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('folders');
            expect(collection.findOne).toHaveBeenCalledWith({ title, userId });
            expect(result).toBe(true);
        });

        it('should return false if folder does not exist', async () => {
            const title = 'Nonexistent Folder';
            const userId = '12345';

            // Mock the database response
            collection.findOne.mockResolvedValue(null);

            const result = await folders.folderExists(title, userId);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('folders');
            expect(collection.findOne).toHaveBeenCalledWith({ title, userId });
            expect(result).toBe(false);
        });
    });

    describe('copy', () => {
        it('should copy a folder and return the new folder ID', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';
            const userId = '12345';
            const newFolderId = ObjectId.createFromTime();
            // Mock some quizzes that are in folder.content
            const sourceFolder = {
                title: 'Test Folder',
                content: [
                    { title: 'Quiz 1', content: [] },
                    { title: 'Quiz 2', content: [] },
                ],
            };

            // Mock the response from getFolderWithContent
            jest.spyOn(folders, 'getFolderWithContent').mockResolvedValue(sourceFolder);
            jest.spyOn(folders, 'create').mockResolvedValue(newFolderId);
            // Mock the response from Quiz.createQuiz
            jest.spyOn(quizzes, 'create').mockImplementation(() => {});

            const result = await folders.copy(folderId, userId);

            // expect(db.connect).toHaveBeenCalled();
            // expect(db.collection).toHaveBeenCalledWith('folders');
            // expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
            // expect(collection.insertOne).toHaveBeenCalledWith(expect.objectContaining({ userId }));
            expect(result).toBe(newFolderId);
        });

        it('should throw an error if the folder does not exist', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';
            const userId = '12345';

            // Mock the response from getFolderWithContent
            jest.spyOn(folders, 'getFolderWithContent').mockImplementation(() => {
                throw new Error(`Folder ${folderId} not found`);
            });

            await expect(folders.copy(folderId, userId)).rejects.toThrow(`Folder ${folderId} not found`);

            // expect(db.connect).toHaveBeenCalled();
            // expect(db.collection).toHaveBeenCalledWith('folders');
            // expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
        });
    });

    // write a test for getFolderWithContent
    describe('getFolderWithContent', () => {
        it('should return a folder with content', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';
            const folder = {
                _id: ObjectId.createFromTime(folderId),
                title: 'Test Folder',
            };
            const content = {
                content :  [
                { title: 'Quiz 1', content: [] },
                { title: 'Quiz 2', content: [] },
            ]};

            // Mock the response from getFolderById
            jest.spyOn(folders, 'getFolderById').mockResolvedValue(folder);

            // Mock the response from getContent
            jest.spyOn(folders, 'getContent').mockResolvedValue(content);

            const result = await folders.getFolderWithContent(folderId);

            // expect(db.connect).toHaveBeenCalled();
            // expect(db.collection).toHaveBeenCalledWith('folders');
            // expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
            expect(result).toEqual({
                ...folder,
                content: content
            });
        });

        it('should throw an error if the folder does not exist', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';

            // // Mock the database response
            // collection.findOne.mockResolvedValue(null);

            // Mock getFolderById to throw an error
            jest.spyOn(folders, 'getFolderById').mockImplementation(() => {
                throw new Error(`Folder ${folderId} not found`);
            });

            await expect(folders.getFolderWithContent(folderId)).rejects.toThrow(`Folder ${folderId} not found`);

            // expect(db.connect).toHaveBeenCalled();
            // expect(db.collection).toHaveBeenCalledWith('folders');
            // expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
        });
    });

    // write a test for getContent
    describe('getContent', () => {
        it('should return the content of a folder', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';
            const content = [
                { title: 'Quiz 1', content: [] },
                { title: 'Quiz 2', content: [] },
            ];

            // Mock the database response
            collection.find().toArray.mockResolvedValue(content);

            const result = await folders.getContent(folderId);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('files');
            expect(collection.find).toHaveBeenCalledWith({ folderId });
            expect(result).toEqual(content);
        });

        it('should return an empty array if the folder has no content', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';

            // Mock the database response
            collection.find().toArray.mockResolvedValue([]);

            const result = await folders.getContent(folderId);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('files');
            expect(collection.find).toHaveBeenCalledWith({ folderId });
            expect(result).toEqual([]);
        });
    });

    // write a test for getFolderById
    describe('getFolderById', () => {
        it('should return a folder by ID', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';
            const folder = {
                _id: ObjectId.createFromTime(folderId),
                title: 'Test Folder',
            };

            // Mock the database response
            collection.findOne.mockResolvedValue(folder);

            const result = await folders.getFolderById(folderId);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('folders');
            expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
            expect(result).toEqual(folder);
        });

        it('should throw an error if the folder does not exist', async () => {
            const folderId = '60c72b2f9b1d8b3a4c8e4d3b';

            // Mock the database response
            collection.findOne.mockResolvedValue(null);

            await expect(folders.getFolderById(folderId)).resolves.toThrow(`Folder ${folderId} not found`);

            expect(db.connect).toHaveBeenCalled();
            expect(db.collection).toHaveBeenCalledWith('folders');
            expect(collection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromTime(folderId) });
        });
    });
});
