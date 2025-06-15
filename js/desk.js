import * as THREE from 'three';
import { DESK_WIDTH, DESK_HEIGHT, DESK_DEPTH, FRAME_THICKNESS, BOARD_THICKNESS } from './constants.js';

export function createDesk() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });

    const createSideAssembly = (isLeft) => {
        const side = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        const xPos = sign * (DESK_WIDTH / 2 - FRAME_THICKNESS / 2);
        const legGeo = new THREE.BoxGeometry(FRAME_THICKNESS, DESK_HEIGHT, FRAME_THICKNESS);
        const backLeg = new THREE.Mesh(legGeo, material);
        backLeg.position.set(xPos, DESK_HEIGHT / 2, -DESK_DEPTH + FRAME_THICKNESS / 2);
        const bottomShelfGeo = new THREE.BoxGeometry(0.4, BOARD_THICKNESS, DESK_DEPTH);
        const bottomShelf = new THREE.Mesh(bottomShelfGeo, material);
        bottomShelf.position.set(xPos, 0.2, -DESK_DEPTH / 2);
        side.add(backLeg, bottomShelf);
        return side;
    };
    
    group.add(createSideAssembly(true), createSideAssembly(false));

    const deskY = 0.74;
    const midShelfY = deskY + 0.1 + BOARD_THICKNESS;

    const topShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH, BOARD_THICKNESS, 0.25), material);
    topShelf.position.set(0, DESK_HEIGHT - BOARD_THICKNESS / 2, -DESK_DEPTH + 0.125);
    
    const midShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH, BOARD_THICKNESS, 0.35), material);
    midShelf.position.set(0, midShelfY, -DESK_DEPTH + 0.175);
    
    group.add(topShelf, midShelf);

    const topShelfY = DESK_HEIGHT - BOARD_THICKNESS / 2;
    const upperWallHeight = topShelfY - midShelfY;
    const upperWallGeo = new THREE.BoxGeometry(FRAME_THICKNESS, upperWallHeight, 0.35);
    const upperWallL = new THREE.Mesh(upperWallGeo, material);
    upperWallL.position.set(-(DESK_WIDTH / 2 - FRAME_THICKNESS/2), midShelfY + upperWallHeight / 2, -DESK_DEPTH + 0.175);
    const upperWallR = new THREE.Mesh(upperWallGeo, material);
    upperWallR.position.set(DESK_WIDTH / 2 - FRAME_THICKNESS/2, midShelfY + upperWallHeight / 2, -DESK_DEPTH + 0.175);
    group.add(upperWallL, upperWallR);
    const mainDeskWidth = DESK_WIDTH;
    const cutoutWidth = 0.5;
    const cutoutDepth = 0.15;
    const sidePieceWidth = (mainDeskWidth - cutoutWidth) / 2;
    const deskBackPiece = new THREE.Mesh(new THREE.BoxGeometry(mainDeskWidth, BOARD_THICKNESS, DESK_DEPTH - cutoutDepth), material);
    deskBackPiece.position.set(0, deskY, - (cutoutDepth + (DESK_DEPTH - cutoutDepth)/2) );
    const deskLeftPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskLeftPiece.position.set( - (cutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);
    const deskRightPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskRightPiece.position.set( (cutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);
    group.add(deskBackPiece, deskLeftPiece, deskRightPiece);
    const wingGeo = new THREE.BoxGeometry(0.3, BOARD_THICKNESS, 0.25);
    const wingL = new THREE.Mesh(wingGeo, material);
    wingL.position.set(-DESK_WIDTH / 2 - 0.15, midShelfY, -DESK_DEPTH + 0.125);
    const wingR = new THREE.Mesh(wingGeo, material);
    wingR.position.set(DESK_WIDTH / 2 + 0.15, midShelfY, -DESK_DEPTH + 0.125);
    group.add(wingL, wingR);
    return group;
} 