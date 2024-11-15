// Dashboard.tsx
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { parse } from 'gift-pegjs';

import Template from '../../../components/GiftTemplate/templates';
import { QuizType } from '../../../Types/QuizType';
import { FolderType } from '../../../Types/FolderType';
// import { QuestionService } from '../../../services/QuestionService';
import ApiService from '../../../services/ApiService';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';
//import axios from 'axios';

import {
    TextField,
    IconButton,
    InputAdornment,
    Button,
    Tooltip,
    NativeSelect
} from '@mui/material';
import {
    Search,
    DeleteOutline,
    FileDownload,
    Add,
    Upload,
    ContentCopy,
    Edit,
    Share,
    // DriveFileMove
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>(''); // Selected folder

    useEffect(() => {
        const fetchData = async () => {
            if (!ApiService.isLoggedIn()) {
                navigate("/teacher/login");
                return;
            }
            else {
                let userFolders = await ApiService.getUserFolders();

                setFolders(userFolders as FolderType[]);
            }

        };

        fetchData();
    }, []);



















    const handleSelectFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolder(event.target.value);
    };


    useEffect(() => {
        const fetchQuizzesForFolder = async () => {

            if (selectedFolder == '') {
                const folders = await ApiService.getUserFolders(); // HACK force user folders to load on first load
                console.log("show all quizes")
                var quizzes: QuizType[] = [];

                for (const folder of folders as FolderType[]) {
                    const folderQuizzes = await ApiService.getFolderContent(folder._id);
                    console.log("folder: ", folder.title, " quiz: ", folderQuizzes);
                    quizzes = quizzes.concat(folderQuizzes as QuizType[])
                }

                setQuizzes(quizzes as QuizType[]);
            }
            else {
                console.log("show some quizzes")
                const folderQuizzes = await ApiService.getFolderContent(selectedFolder);
                console.log("folderQuizzes: ", folderQuizzes);
                setQuizzes(folderQuizzes as QuizType[]);

            }


        };

        fetchQuizzesForFolder();
    }, [selectedFolder]);


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    const handleRemoveQuiz = async (quiz: QuizType) => {
        try {
            const confirmed = window.confirm('Voulez-vous vraiment supprimer ce quiz?');
            if (confirmed) {
                await ApiService.deleteQuiz(quiz._id);
                const updatedQuizzes = quizzes.filter((q) => q._id !== quiz._id);
                setQuizzes(updatedQuizzes);
            }
        } catch (error) {
            console.error('Error removing quiz:', error);
        }
    };


    const handleDuplicateQuiz = async (quiz: QuizType) => {
        try {
            await ApiService.duplicateQuiz(quiz._id);
            if (selectedFolder == '') {
                const folders = await ApiService.getUserFolders(); // HACK force user folders to load on first load
                console.log("show all quizes")
                var quizzes: QuizType[] = [];

                for (const folder of folders as FolderType[]) {
                    const folderQuizzes = await ApiService.getFolderContent(folder._id);
                    console.log("folder: ", folder.title, " quiz: ", folderQuizzes);
                    quizzes = quizzes.concat(folderQuizzes as QuizType[])
                }

                setQuizzes(quizzes as QuizType[]);
            }
            else {
                console.log("show some quizzes")
                const folderQuizzes = await ApiService.getFolderContent(selectedFolder);
                setQuizzes(folderQuizzes as QuizType[]);

            }
        } catch (error) {
            console.error('Error duplicating quiz:', error);
        }
    };

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(
            (quiz) =>
                quiz && quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quizzes, searchTerm]);

    const handleOnImport = () => {
        setShowImportModal(true);

    };

    const validateQuiz = (questions: string[]) => {
        if (!questions || questions.length === 0) {
            return false;
        }

        // Check if I can generate the Template for each question
        // Otherwise the quiz is invalid
        for (let i = 0; i < questions.length; i++) {
            try {
                // questions[i] = QuestionService.ignoreImgTags(questions[i]);
                const parsedItem = parse(questions[i]);
                Template(parsedItem[0]);
            } catch (error) {
                return false;
            }
        }

        return true;
    };

    // const handleMoveQuiz = async (quiz: QuizType, newFolderId: string) => {
    //     try {
    //         await ApiService.moveQuiz(quiz._id, newFolderId);
    //         if (selectedFolder == '') {
    //             const folders = await ApiService.getUserFolders();
    //             var quizzes: QuizType[] = [];

    //             for (const folder of folders as FolderType[]) {
    //                 const folderQuizzes = await ApiService.getFolderContent(folder._id);
    //                 quizzes = quizzes.concat(folderQuizzes as QuizType[])
    //             }

    //             setQuizzes(quizzes as QuizType[]);
    //         }
    //         else {
    //             const folderQuizzes = await ApiService.getFolderContent(selectedFolder);
    //             setQuizzes(folderQuizzes as QuizType[]);
    //         }
    //     } catch (error) {
    //         console.error('Error moving quiz:', error);
    //     }
    // };


    const downloadTxtFile = async (quiz: QuizType) => {

        try {
            const selectedQuiz = await ApiService.getQuiz(quiz._id) as QuizType;
            //quizzes.find((quiz) => quiz._id === quiz._id);

            if (!selectedQuiz) {
                throw new Error('Selected quiz not found');
            }

            //const { title, content } = selectedQuiz;
            let quizContent = "";
            let title = selectedQuiz.title;
            console.log(selectedQuiz.content);
            selectedQuiz.content.forEach((question, qIndex) => {
                const formattedQuestion = question.trim();
                // console.log(formattedQuestion);
                if (formattedQuestion !== '') {
                    quizContent += formattedQuestion + '\n';
                    if (qIndex !== selectedQuiz.content.length - 1) {
                        quizContent += '\n';
                    }
                }
            });

            if (!validateQuiz(selectedQuiz.content)) {
                window.alert('Attention! Ce quiz contient des questions invalides selon le format GIFT.');
            }
            const blob = new Blob([quizContent], { type: 'text/plain' });
            const a = document.createElement('a');
            const filename = title;
            a.download = `${filename}.gift`;
            a.href = window.URL.createObjectURL(blob);
            a.click();


        } catch (error) {
            console.error('Error exporting selected quiz:', error);
        }
    };

    const handleCreateFolder = async () => {
        try {
            const folderTitle = prompt('Titre du dossier');
            if (folderTitle) {
                await ApiService.createFolder(folderTitle);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);                
                const newlyCreatedFolder = userFolders[userFolders.length - 1] as FolderType;
                setSelectedFolder(newlyCreatedFolder._id);
                
            }
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };
  
    const handleDeleteFolder = async () => {


        try {
            const confirmed = window.confirm('Voulez-vous vraiment supprimer ce dossier?');
            if (confirmed) {
                await ApiService.deleteFolder(selectedFolder);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);
            }

            const folders = await ApiService.getUserFolders(); // HACK force user folders to load on first load
            console.log("show all quizes")
            var quizzes: QuizType[] = [];

            for (const folder of folders as FolderType[]) {
                const folderQuizzes = await ApiService.getFolderContent(folder._id);
                console.log("folder: ", folder.title, " quiz: ", folderQuizzes);
                quizzes = quizzes.concat(folderQuizzes as QuizType[])
            }

            setQuizzes(quizzes as QuizType[]);
            setSelectedFolder('');

        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };
    const handleRenameFolder = async () => {
        try {
            // folderId: string GET THIS FROM CURRENT FOLDER
            // currentTitle: string GET THIS FROM CURRENT FOLDER
            const newTitle = prompt('Entrée le nouveau nom du fichier', "Nouveau nom de dossier");
            if (newTitle) {
                await ApiService.renameFolder(selectedFolder, newTitle);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);
                
            }
        } catch (error) {
            console.error('Error renaming folder:', error);
        }
    };
    const handleDuplicateFolder = async () => {
        try {
            // folderId: string GET THIS FROM CURRENT FOLDER
            await ApiService.duplicateFolder(selectedFolder);
            // TODO set the selected folder to be the duplicated folder
            const userFolders = await ApiService.getUserFolders();
            setFolders(userFolders as FolderType[]);
            const newlyCreatedFolder = userFolders[userFolders.length - 1] as FolderType;
            setSelectedFolder(newlyCreatedFolder._id);
        } catch (error) {
            console.error('Error duplicating folder:', error);
        }
    };

    const handleCreateQuiz = () => {
        navigate("/teacher/editor-quiz/new");
    }

    const handleEditQuiz = (quiz: QuizType) => {
        navigate(`/teacher/editor-quiz/${quiz._id}`);
    }

    const handleLancerQuiz = (quiz: QuizType) => {
        navigate(`/teacher/manage-room/${quiz._id}`);
    }

    const handleShareQuiz = async (quiz: QuizType) => {
        try {
            const email = prompt(`Veuillez saisir l'email de la personne avec qui vous souhaitez partager ce quiz`, "");

            if (email) {
                const result = await ApiService.ShareQuiz(quiz._id, email);

                if (!result) {
                    window.alert(`Une erreur est survenue.\n Veuillez réessayer plus tard`)
                    return;
                }

                window.alert(`Quiz partagé avec succès!`)
            }

        } catch (error) {
            console.error('Erreur lors du partage du quiz:', error);
        }
    }




    return (

        <div className="dashboard">

            <div className="title">Tableau de bord</div>

            <div className="search-bar">
                <TextField
                    onChange={handleSearch}
                    value={searchTerm}
                    placeholder="Rechercher un quiz par son titre"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>

            <div className='folder'>
                <div className='select'>
                    <NativeSelect
                        id="select-folder"
                        color="primary"
                        value={selectedFolder}
                        onChange={handleSelectFolder}
                    >
                        <option value=""> Tous les dossiers... </option>

                        {folders.map((folder: FolderType) => (
                            <option value={folder._id} key={folder._id}> {folder.title} </option>
                        ))}
                    </NativeSelect>
                </div>

                <div className='actions'>
                    <Tooltip title="Ajouter dossier" placement="top">
                        <IconButton
                            color="primary"
                            onClick={handleCreateFolder}
                        > <Add /> </IconButton>
                    </Tooltip>

                    <Tooltip title="Renommer dossier" placement="top">
                        <IconButton
                            color="primary"
                            onClick={handleRenameFolder}
                            disabled={selectedFolder == ''} // cannot action on all
                        > <Edit /> </IconButton>
                    </Tooltip>

                    <Tooltip title="Dupliquer dossier" placement="top">
                        <IconButton
                            color="primary"
                            onClick={handleDuplicateFolder}
                            disabled={selectedFolder == ''} // cannot action on all
                        > <ContentCopy /> </IconButton>
                    </Tooltip>

                    <Tooltip title="Supprimer dossier" placement="top">
                        <IconButton
                            aria-label="delete"
                            color="primary"
                            onClick={handleDeleteFolder}
                            disabled={selectedFolder == ''} // cannot action on all
                        > <DeleteOutline /> </IconButton>
                    </Tooltip>
                </div>

            </div>

            <div className='ajouter'>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleCreateQuiz}
                >
                    Ajouter un nouveau quiz
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Upload />}
                    onClick={handleOnImport}
                >
                    Import
                </Button>

            </div>
            <div className='list'>

                {filteredQuizzes.map((quiz: QuizType) => (
                    <div className='quiz'>
                        <div className='title'>
                            <Tooltip title="Lancer quiz" placement="top">
                                <Button
                                    variant="outlined"
                                    onClick={() => handleLancerQuiz(quiz)}
                                    disabled={!validateQuiz(quiz.content)}
                                >
                                    {quiz.title}
                                </Button>
                            </Tooltip>
                        </div>

                        <div className='actions'>
                            <Tooltip title="Télécharger quiz" placement="top">
                                <IconButton
                                    color="primary"
                                    onClick={() => downloadTxtFile(quiz)}
                                > <FileDownload /> </IconButton>
                            </Tooltip>

                            <Tooltip title="Modifier quiz" placement="top">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEditQuiz(quiz)}
                                > <Edit /> </IconButton>
                            </Tooltip>

                            {/* <Tooltip title="Bouger quiz" placement="top">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleMoveQuiz(quiz)}
                                > <DriveFileMove /> </IconButton>
                            </Tooltip> */}

                            <Tooltip title="Dupliquer quiz" placement="top">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleDuplicateQuiz(quiz)}
                                > <ContentCopy /> </IconButton>
                            </Tooltip>

                            <Tooltip title="Supprimer quiz" placement="top">
                                <IconButton
                                    aria-label="delete"
                                    color="primary"
                                    onClick={() => handleRemoveQuiz(quiz)}
                                > <DeleteOutline /> </IconButton>
                            </Tooltip>

                            <Tooltip title="Partager quiz" placement="top">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleShareQuiz(quiz)}
                                > <Share /> </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>

            <ImportModal
                open={showImportModal}
                handleOnClose={() => setShowImportModal(false)}
                handleOnImport={handleOnImport}
                selectedFolder={selectedFolder}
            />

        </div>
    );
};

export default Dashboard;
