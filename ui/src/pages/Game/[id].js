import { useEffect } from 'react';

const ChessGame = () => {
    useEffect(() => {
        import('phaser').then((Phaser) => {
            const config = {
                type: Phaser.AUTO,
                parent: 'chess-container',
                width: 576,
                height: 576,
                scene: {
                    preload: preload,
                    create: create,
                },
            };

            const game = new Phaser.Game(config);

            const gridSize = 8; // Size of the chess grid
            const tileSize = 72; // Size of each tile in pixels

            const pieceTypes = ['Bishop', 'King', 'Knight', 'Pawn', 'Queen', 'Rook'];
            const pieceSides = ['Black', 'White'];

            function preload() {
                this.load.image('Board', '/Board.png');
                pieceTypes.forEach((pieceType) => {
                    pieceSides.forEach((pieceSide) => {
                        const imageName = `Piece=${pieceType}, Side=${pieceSide}.png`;
                        this.load.image(`${pieceType}_${pieceSide}`, `/${imageName}`);
                    });
                });
                this.load.image('possibleMovement', '/possibleMovement.png');
                this.load.image('Check', '/Check.png');

            }

            function create() {
                const chessboard = this.add.image(0, 0, 'Board');
                chessboard.setDisplaySize(game.config.width, game.config.height);
                chessboard.setOrigin(0, 0);

                let chessGrid = createChessGrid();

                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        const pieceType = getPieceType(j, i);
                        const pieceSide = getPieceSide(i);
                        if (pieceType) {
                            const chessPiece = this.add.image(
                                (j + 0.5) * tileSize, // Coordonnée X ajustée
                                (i + 0.5) * tileSize, // Coordonnée Y ajustée
                                `${pieceType}_${pieceSide}`
                            );
                            chessPiece.setInteractive({ draggable: true });
                            chessPiece.setData('pieceType', pieceType);
                            chessPiece.setData('pieceSide', pieceSide);
                            chessPiece.setData('hasMoved', false);
                            chessPiece.depth = 1;

                            this.input.setDraggable(chessPiece);

                            this.input.on('dragstart', onDragStart, this);
                            this.input.on('drag', onDrag, this);
                            this.input.on('dragend', onDragEnd, this);

                            chessGrid[i][j] = chessPiece;

                        }
                    }
                }

                function getPieceType(colIndex, rowIndex) {
                    const row = rowIndex % 2;
                    const col = colIndex % 2;
                    const isDarkTile = (row === 0 && col === 0) || (row === 1 && col === 1);

                    if (rowIndex === 0 || rowIndex === 7) {
                        // Back row, place the back row pieces
                        switch (colIndex) {
                            case 0:
                            case 7:
                                return isDarkTile ? 'Rook' : 'Rook';
                            case 1:
                            case 6:
                                return isDarkTile ? 'Knight' : 'Knight';
                            case 2:
                            case 5:
                                return isDarkTile ? 'Bishop' : 'Bishop';
                            case 3:
                                return 'Queen';
                            case 4:
                                return 'King';
                            default:
                                break;
                        }
                    } else if (rowIndex === 1 || rowIndex === 6) {
                        // Pawns row
                        return 'Pawn';
                    }

                    return ''; // Empty tile
                }

                function getPieceSide(rowIndex) {
                    return rowIndex < Math.floor(gridSize / 2) ? 'Black' : 'White';
                }

                function isWithinGrid(x, y) {
                    return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
                }

                function getValidMovesForPawn(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];
                    const forwardY = piece.getData('pieceSide') === 'Black' ? gridY + 1 : gridY - 1;

                    // Check if the first move is available (two squares forward)
                    const initialForwardY = piece.getData('pieceSide') === 'Black' ? 1 : gridSize - 2;
                    const forward2Y = piece.getData('pieceSide') === 'Black' ? gridY + 2 : gridY - 2;
                    if (gridY === initialForwardY && !chessGrid[forwardY][gridX] && !chessGrid[forwardY + (piece.getData('pieceSide') === 'Black' ? 1 : -1)][gridX]) {
                        validMoves.push({ x: gridX, y: forward2Y });
                    }

                    // Check forward movement
                    if (isWithinGrid(gridX, forwardY) && !chessGrid[forwardY][gridX]) {
                        validMoves.push({ x: gridX, y: forwardY });
                    }

                    // Check diagonal captures
                    const diagonalMoves = [
                        { x: gridX - 1, y: forwardY },
                        { x: gridX + 1, y: forwardY },
                    ];
                    diagonalMoves.forEach((move) => {
                        const { x, y } = move;
                        if (isWithinGrid(x, y) && chessGrid[y][x]) {
                            const targetPiece = chessGrid[y][x];
                            if (targetPiece.getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y });
                            }
                        }
                    });

                    return validMoves;
                }

                function getValidMovesForRook(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];

                    // Check horizontal movements to the right
                    for (let x = gridX + 1; x < gridSize; x++) {
                        if (chessGrid[gridY][x]) {
                            if (chessGrid[gridY][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y: gridY });
                            }
                            break;
                        }
                        validMoves.push({ x, y: gridY });
                    }

                    // Check horizontal movements to the left
                    for (let x = gridX - 1; x >= 0; x--) {
                        if (chessGrid[gridY][x]) {
                            if (chessGrid[gridY][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y: gridY });
                            }
                            break;
                        }
                        validMoves.push({ x, y: gridY });
                    }

                    // Check vertical movements upwards
                    for (let y = gridY - 1; y >= 0; y--) {
                        if (chessGrid[y][gridX]) {
                            if (chessGrid[y][gridX].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x: gridX, y });
                            }
                            break;
                        }
                        validMoves.push({ x: gridX, y });
                    }

                    // Check vertical movements downwards
                    for (let y = gridY + 1; y < gridSize; y++) {
                        if (chessGrid[y][gridX]) {
                            if (chessGrid[y][gridX].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x: gridX, y });
                            }
                            break;
                        }
                        validMoves.push({ x: gridX, y });
                    }

                    return validMoves;
                }

                function getValidMovesForBishop(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];

                    // Check diagonal movements to the top right
                    for (let x = gridX + 1, y = gridY - 1; x < gridSize && y >= 0; x++, y--) {
                        if (chessGrid[y][x]) {
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements to the top left
                    for (let x = gridX - 1, y = gridY - 1; x >= 0 && y >= 0; x--, y--) {
                        if (chessGrid[y][x]) {
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements to the bottom right
                    for (let x = gridX + 1, y = gridY + 1; x < gridSize && y < gridSize; x++, y++) {
                        if (chessGrid[y][x]) {
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements to the bottom left
                    for (let x = gridX - 1, y = gridY + 1; x >= 0 && y < gridSize; x--, y++) {
                        if (chessGrid[y][x]) {
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                // If there is an opponent's piece in the way, include the position as a valid move
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    return validMoves;
                }

                function getValidMovesForKnight(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];

                    const possibleMoves = [
                        { x: gridX + 2, y: gridY + 1 },
                        { x: gridX + 2, y: gridY - 1 },
                        { x: gridX - 2, y: gridY + 1 },
                        { x: gridX - 2, y: gridY - 1 },
                        { x: gridX + 1, y: gridY + 2 },
                        { x: gridX + 1, y: gridY - 2 },
                        { x: gridX - 1, y: gridY + 2 },
                        { x: gridX - 1, y: gridY - 2 },
                    ];

                    possibleMoves.forEach((move) => {
                        const { x, y } = move;
                        if (isWithinGrid(x, y) && (!chessGrid[y][x] || chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide'))) {
                            validMoves.push({ x, y });
                        }
                    });

                    return validMoves;
                }

                function getValidMovesForQueen(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];

                    // Check horizontal movements to the right
                    for (let x = gridX + 1; x < gridSize; x++) {
                        if (chessGrid[gridY][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[gridY][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y: gridY });
                            }
                            break;
                        }
                        validMoves.push({ x, y: gridY });
                    }

                    // Check horizontal movements to the left
                    for (let x = gridX - 1; x >= 0; x--) {
                        if (chessGrid[gridY][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[gridY][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y: gridY });
                            }
                            break;
                        }
                        validMoves.push({ x, y: gridY });
                    }

                    // Check vertical movements upwards
                    for (let y = gridY - 1; y >= 0; y--) {
                        if (chessGrid[y][gridX]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][gridX].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x: gridX, y });
                            }
                            break;
                        }
                        validMoves.push({ x: gridX, y });
                    }

                    // Check vertical movements downwards
                    for (let y = gridY + 1; y < gridSize; y++) {
                        if (chessGrid[y][gridX]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][gridX].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x: gridX, y });
                            }
                            break;
                        }
                        validMoves.push({ x: gridX, y });
                    }

                    // Check diagonal movements towards the top right
                    for (let x = gridX + 1, y = gridY - 1; x < gridSize && y >= 0; x++, y--) {
                        if (chessGrid[y][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements towards the top left
                    for (let x = gridX - 1, y = gridY - 1; x >= 0 && y >= 0; x--, y--) {
                        if (chessGrid[y][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements towards the bottom right
                    for (let x = gridX + 1, y = gridY + 1; x < gridSize && y < gridSize; x++, y++) {
                        if (chessGrid[y][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    // Check diagonal movements towards the bottom left
                    for (let x = gridX - 1, y = gridY + 1; x >= 0 && y < gridSize; x--, y++) {
                        if (chessGrid[y][x]) {
                            // If there is a piece in the way, break the loop
                            if (chessGrid[y][x].getData('pieceSide') !== piece.getData('pieceSide')) {
                                validMoves.push({ x, y });
                            }
                            break;
                        }
                        validMoves.push({ x, y });
                    }

                    return validMoves;
                }

                function getValidMovesForKing(piece, gridX, gridY, chessGrid) {
                    const validMoves = [];
                    const directions = [-1, 0, 1];

                    directions.forEach((dx) => {
                        directions.forEach((dy) => {
                            if (dx === 0 && dy === 0) {
                                // Skip the current position
                                return;
                            }

                            const x = gridX + dx;
                            const y = gridY + dy;

                            if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                                const targetPiece = chessGrid[y][x];

                                if (!targetPiece || targetPiece.getData('pieceSide') !== piece.getData('pieceSide')) {
                                    validMoves.push({ x, y });
                                }
                            }
                        });
                    });

                    // Vérifie si le "Rock" est possible
                    const canCastleKingSide = isCastleKingSidePossible(piece, gridX, gridY, chessGrid);
                    const canCastleQueenSide = isCastleQueenSidePossible(piece, gridX, gridY, chessGrid);

                    if (canCastleKingSide) {
                        validMoves.push({ x: gridX + 2, y: gridY });
                    }

                    if (canCastleQueenSide) {
                        validMoves.push({ x: gridX - 2, y: gridY });
                    }

                    return validMoves;
                }

                function getValidMoves(pieceType, gridX, gridY, chessGrid, piece) {
                    switch (pieceType) {
                        case 'Pawn':
                            return getValidMovesForPawn(piece,gridX, gridY, chessGrid);
                        case 'Rook':
                            return getValidMovesForRook(piece, gridX, gridY, chessGrid);
                        case 'Bishop':
                            return getValidMovesForBishop(piece,gridX, gridY, chessGrid);
                        case 'Knight':
                            return getValidMovesForKnight(piece,gridX, gridY, chessGrid);
                        case 'Queen':
                            return getValidMovesForQueen(piece,gridX, gridY, chessGrid);
                        case 'King':
                            return getValidMovesForKing(piece,gridX, gridY, chessGrid);
                        default:
                            return [];
                    }
                }


                function highlightValidMoves(piece, validMoves) {
                    const scene = piece.scene;

                    // Display valid moves with the "possibleMovement" image
                    validMoves.forEach((move) => {
                        const { x, y } = move;
                        const highlight = scene.add.image((x + 0.5) * tileSize, (y + 0.5) * tileSize, 'possibleMovement');
                        highlight.name = 'possibleMovement';
                        highlight.depth = 1;
                    });
                }

                function removeHighlight(scene) {
                    const objectsToRemove = [];

                    // Find objects to be removed
                    scene.children.each((child) => {
                        if (child.name === 'possibleMovement') {
                            objectsToRemove.push(child);
                        }
                    });

                    // Remove the objects
                    objectsToRemove.forEach((object) => {
                        object.destroy();
                    });
                }

                function highlightCheck(king) {
                    const scene = king.scene;
                    const kingX = Math.floor(king.x / tileSize);
                    const kingY = Math.floor(king.y / tileSize);
                    const highlight = scene.add.image((kingX + 0.5) * tileSize, (kingY + 0.5) * tileSize, 'Check');
                    highlight.name = 'Check';

                    highlight.depth = 0;
                }

                function removeHighlightCheck(scene) {
                    const objectsToRemove = [];

                    // Find objects to be removed
                    scene.children.each((child) => {
                        if (child.name === 'Check') {
                            objectsToRemove.push(child);
                        }
                    });

                    // Remove the objects
                    objectsToRemove.forEach((object) => {
                        object.destroy();
                    });
                }

                function isKingCheck(king, chessGrid) {
                    const pieceSide = king.getData('pieceSide');
                    const kingX = Math.floor(king.x / tileSize);
                    const kingY = Math.floor(king.y / tileSize);

                    // Check if the king is in check
                    const isCheck = chessGrid.some((row, y) => {
                        return row.some((targetPiece, x) => {
                            if (targetPiece && targetPiece.getData('pieceSide') !== pieceSide) {
                                const validMoves = getValidMoves(targetPiece.getData('pieceType'), x, y, chessGrid, targetPiece);

                                return validMoves.some((move) => {
                                    return move.x === kingX && move.y === kingY;
                                });
                            }
                            return false;
                        });
                    });

                    return isCheck;
                }

                function isCastleKingSidePossible(kingPiece, kingGridX, kingGridY, chessGrid) {
                    // Vérifie si le roi est déjà déplacé
                    if (kingPiece.getData('hasMoved')) {
                        return false;
                    }

                    // Vérifie si les cases entre le roi et la tour sont vides
                    for (let x = kingGridX + 1; x <= kingGridX + 2; x++) {
                        if (chessGrid[kingGridY][x] !== null) {
                            return false;
                        }
                    }

                    // Vérifie si les cases sont sous attaque
                    for (let x = kingGridX; x <= kingGridX + 2; x++) {
                        if (isGridPositionUnderAttack(x, kingGridY, chessGrid, kingPiece.getData('pieceSide'))) {
                            return false;
                        }
                    }

                    // Vérifie si la tour est présente et n'a pas été déplacée
                    const rookPiece = chessGrid[kingGridY][kingGridX + 3];
                    if (rookPiece === null || rookPiece.getData('hasMoved')) {
                        return false;
                    }

                    return true;
                }

                function isCastleQueenSidePossible(kingPiece, kingGridX, kingGridY, chessGrid) {
                    // Vérifie si le roi est déjà déplacé
                    if (kingPiece.getData('hasMoved')) {
                        return false;
                    }

                    // Vérifie si les cases entre le roi et la tour sont vides
                    for (let x = kingGridX - 1; x >= kingGridX - 3; x--) {
                        if (chessGrid[kingGridY][x] !== null) {
                            return false;
                        }
                    }

                    // Vérifie si les cases sont sous attaque
                    for (let x = kingGridX; x >= kingGridX - 2; x--) {
                        if (isGridPositionUnderAttack(x, kingGridY, chessGrid, kingPiece.getData('pieceSide'))) {
                            return false;
                        }
                    }

                    // Vérifie si la tour est présente et n'a pas été déplacée
                    const rookPiece = chessGrid[kingGridY][kingGridX - 4];
                    if (rookPiece === null || rookPiece.getData('hasMoved')) {
                        return false;
                    }

                    return true;
                }

                function isGridPositionUnderAttack(gridX, gridY, chessGrid,attackingSide) {
                    // Recherche des pièces ennemies
                    for (let i = 0; i < gridSize; i++) {
                        for (let j = 0; j < gridSize; j++) {
                            const piece = chessGrid[i][j];

                            // Vérifier si la pièce existe et si elle est du côté opposé
                            if (piece && piece.getData('pieceSide') !== attackingSide) {
                                // Vérifier si la pièce peut attaquer la position spécifiée
                                if (canPieceAttackPosition(piece, j, i, gridX, gridY, chessGrid)) {
                                    return true; // La position est attaquée
                                }
                            }
                        }
                    }

                    return false; // La position n'est pas attaquée
                }

                function canPieceAttackPosition(piece, pieceGridX, pieceGridY, targetGridX, targetGridY, chessGrid) {
                    const validMoves = getValidMoves(piece.getData('pieceType'), pieceGridX, pieceGridY, chessGrid, piece);
                    const targetMove = validMoves.find(move => move.x === targetGridX && move.y === targetGridY);
                    return !!targetMove;
                }

                function performKingSideCastle(kingPiece, rookPiece, chessGrid) {
                    const kingGridX = kingPiece.getData('gridX');
                    const kingGridY = kingPiece.getData('gridY');
                    const rookGridX = rookPiece.getData('gridX');
                    const rookGridY = rookPiece.getData('gridY');

                    // Mettre à jour les positions du roi et de la tour dans la grille
                    chessGrid[kingGridY][kingGridX] = null;
                    chessGrid[rookGridY][rookGridX] = null;

                    const newKingGridX = kingGridX + 2;
                    const newRookGridX = rookGridX - 2;

                    chessGrid[kingGridY][newKingGridX] = kingPiece;
                    chessGrid[rookGridY][newRookGridX] = rookPiece;

                    // Mettre à jour les données de position des pièces
                    kingPiece.setData('gridX', newKingGridX);
                    rookPiece.setData('gridX', newRookGridX);
                }

                function performQueenSideCastle(kingPiece, rookPiece, chessGrid) {
                    const kingGridX = kingPiece.getData('gridX');
                    const kingGridY = kingPiece.getData('gridY');
                    const rookGridX = rookPiece.getData('gridX');
                    const rookGridY = rookPiece.getData('gridY');

                    // Mettre à jour les positions du roi et de la tour dans la grille
                    chessGrid[kingGridY][kingGridX] = null;
                    chessGrid[rookGridY][rookGridX] = null;

                    const newKingGridX = kingGridX - 2;
                    const newRookGridX = rookGridX + 3;

                    chessGrid[kingGridY][newKingGridX] = kingPiece;
                    chessGrid[rookGridY][newRookGridX] = rookPiece;

                    // Mettre à jour les données de position des pièces
                    kingPiece.setData('gridX', newKingGridX);
                    rookPiece.setData('gridX', newRookGridX);
                }


                let isDragging = false;
                function onDragStart(pointer, gameObject) {
                    this.children.bringToTop(gameObject);
                    isDragging = true;

                    // Obtenir les coordonnées de la case actuelle de la pièce
                    const gridX = Math.floor(gameObject.x / tileSize);
                    const gridY = Math.floor(gameObject.y / tileSize);

                    // Obtenir le type de la pièce
                    const pieceType = gameObject.getData('pieceType');

                    // Obtenir les mouvements valides en fonction du type de pièce
                    let validMoves = [];
                    switch (pieceType) {
                        case 'King':
                            validMoves = getValidMovesForKing(gameObject, gridX, gridY, chessGrid);
                            break;
                        case 'Queen':
                            validMoves = getValidMovesForQueen(gameObject, gridX, gridY, chessGrid);
                            break;
                        case 'Bishop':
                            validMoves = getValidMovesForBishop(gameObject, gridX, gridY, chessGrid);
                            break;
                        case 'Knight':
                            validMoves = getValidMovesForKnight(gameObject, gridX, gridY, chessGrid);
                            break;
                        case 'Pawn':
                            validMoves = getValidMovesForPawn(gameObject, gridX, gridY, chessGrid);
                            break;
                        case 'Rook':
                            validMoves = getValidMovesForRook(gameObject, gridX, gridY, chessGrid);
                            break;
                    }

                    // Mettre en évidence les mouvements valides
                    highlightValidMoves(gameObject, validMoves);
                }


                function onDrag(pointer, gameObject, dragX, dragY) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                }

                function onDragEnd(pointer, gameObject) {
                    if (!isDragging) {
                        return;
                    }

                    isDragging = false;

                    const pieceType = gameObject.getData('pieceType');
                    const pieceSide = gameObject.getData('pieceSide');


                    let gridX, gridY;

                    if (pieceType && pieceSide) {
                        const initialGridX = Math.floor(gameObject.input.dragStartX / tileSize);
                        const initialGridY = Math.floor(gameObject.input.dragStartY / tileSize);

                        gridX = Math.floor(gameObject.x / tileSize);
                        gridY = Math.floor(gameObject.y / tileSize);
                        console.log(chessGrid)

                        const validMoves = getValidMoves(pieceType, initialGridX, initialGridY, chessGrid, gameObject);

                        const isMoveValid = validMoves.some((move) => move.x === gridX && move.y === gridY);

                        if (isMoveValid) {

                            let newGrid = chessGrid.map((row) => {
                                return row.map((piece) => {
                                    if (piece === gameObject) {
                                        return null;
                                    }
                                    return piece;
                                });
                            });

                            let king = gameObject;

                            if (pieceType !== 'King'){
                                newGrid.forEach((row) => {
                                    row.forEach((piece) => {
                                        if (piece && piece.getData('pieceType') === 'King' && piece.getData('pieceSide') === pieceSide) {
                                            king = piece;
                                        }
                                    });
                                });
                            }

                            newGrid[initialGridY][initialGridX] = null;
                            newGrid[gridY][gridX] = gameObject;

                            const checked = isKingCheck(king, newGrid);

                            if (checked) {
                                // Move is not valid, reset the piece position
                                gameObject.x = (initialGridX + 0.5) * tileSize;
                                gameObject.y = (initialGridY + 0.5) * tileSize;
                                removeHighlight(gameObject.scene);
                                return;
                            }


                            // Check if there is a piece at the destination
                            const pieceAtDestination = chessGrid[gridY][gridX];
                            if (pieceAtDestination) {
                                // Remove the piece from the game scene
                                pieceAtDestination.destroy();
                            }

                            // Vérifier si la pièce déplacée est le roi
                            if (pieceType === 'King') {

                                // Vérifier si le mouvement correspond à un mouvement de roque valide
                                const movedDistance = Math.abs(gameObject.x - gameObject.input.dragStartX);

                                if (movedDistance > tileSize ) {
                                    // Le mouvement correspond à un roque

                                    // Vérifier la direction du roque (roi vers roi ou roi vers dame)
                                    if (gameObject.x > gameObject.input.dragStartX) {
                                        // Roque du côté roi (roque court)
                                        const rookPiece = chessGrid[gridY][gridX + 4]; // Récupérer la tour du côté roi
                                        console.log(rookPiece)
                                        performKingSideCastle(gameObject, rookPiece, chessGrid);
                                    } else {
                                        // Roque du côté dame (roque long)
                                        const rookPiece = chessGrid[gridY][gridX - 4]; // Récupérer la tour du côté dame
                                        performQueenSideCastle(gameObject, rookPiece, chessGrid);
                                    }
                                }
                            }

                            // Perform the move
                            gameObject.x = (gridX + 0.5) * tileSize;
                            gameObject.y = (gridY + 0.5) * tileSize;

                            chessGrid[initialGridY][initialGridX] = null;
                            chessGrid[gridY][gridX] = gameObject;
                            let inversePieceSide = null;
                            // inverse pieceSide
                            if (pieceSide === 'White') {
                                inversePieceSide = 'Black';
                            } else {
                                inversePieceSide = 'White';
                            }

                            // Check if the king is in check
                            //get the king

                            chessGrid.forEach((row) => {
                                row.forEach((piece) => {
                                    if (piece && piece.getData('pieceType') === 'King' && piece.getData('pieceSide') === inversePieceSide) {
                                        king = piece;
                                    }
                                });
                            });

                            const isCheck = isKingCheck(king, chessGrid);

                            if(isCheck){
                                highlightCheck(king);
                            } else {
                                removeHighlightCheck(king.scene);
                            }

                            gameObject.setData('hasMoved', true);

                            removeHighlight(gameObject.scene);
                        } else {
                            // Move is not valid, reset the piece position
                            gameObject.x = (initialGridX + 0.5) * tileSize;
                            gameObject.y = (initialGridY + 0.5) * tileSize;
                            removeHighlight(gameObject.scene);
                        }
                    }

                    removeHighlight(gameObject.scene);
                }


                function createChessGrid() {
                    const grid = [];
                    for (let i = 0; i < gridSize; i++) {
                        grid[i] = [];
                        for (let j = 0; j < gridSize; j++) {
                            grid[i][j] = null;
                        }
                    }
                    return grid;
                }
            }
        });
    }, []);

    return <div id="chess-container" />;
};

export default ChessGame;
