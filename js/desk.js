import * as THREE from 'three';
import { DESK_WIDTH, DESK_HEIGHT, DESK_DEPTH, FRAME_THICKNESS, BOARD_THICKNESS, FRAME_THICKNESS_2 } from './constants.js';

export function createDesk() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });

    // --- Define core vertical dimensions first to avoid ReferenceError ---
    const deskY = 0.74;
    const bottomShelfY = 0.2;

    const createSideAssembly = (isLeft) => {
        const side = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        const xPos = sign * (DESK_WIDTH / 2 - FRAME_THICKNESS / 2);
        const zPos = -DESK_DEPTH + FRAME_THICKNESS / 2; // Shared Z for back pillars

        // Upper back pillar (Top of desk to main desk surface)
        const upperPillarHeight = DESK_HEIGHT - deskY;
        const upperPillarY = deskY + upperPillarHeight / 2;
        const upperPillar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, upperPillarHeight, FRAME_THICKNESS),
            material
        );
        upperPillar.position.set(xPos, upperPillarY, zPos);
        
        // Middle back pillar (Main desk surface down to bottom shelf)
        const middlePillarHeight = deskY - bottomShelfY;
        const middlePillarY = bottomShelfY + middlePillarHeight / 2;
        const middlePillar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, middlePillarHeight, FRAME_THICKNESS),
            material
        );
        middlePillar.position.set(xPos, middlePillarY, zPos);

        // Lower back pillar (Bottom shelf down to floor)
        const lowerPillarHeight = bottomShelfY; // Sits on the floor, goes up to shelf
        const lowerPillarY = lowerPillarHeight / 2;
        const lowerPillar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, lowerPillarHeight, FRAME_THICKNESS),
            material
        );
        lowerPillar.position.set(xPos, lowerPillarY, zPos);

        side.add(upperPillar, middlePillar, lowerPillar);
        return side;
    };
    
    group.add(createSideAssembly(true), createSideAssembly(false));

    const midShelfY = deskY + 0.1 + BOARD_THICKNESS;
    const monitorShelfDepth = 0.35;

    const topShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH, BOARD_THICKNESS, monitorShelfDepth), material);
    topShelf.position.set(0, DESK_HEIGHT - BOARD_THICKNESS / 2, -DESK_DEPTH + monitorShelfDepth / 2);
    
    const midShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH, BOARD_THICKNESS, monitorShelfDepth), material);
    midShelf.position.set(0, midShelfY, -DESK_DEPTH + monitorShelfDepth / 2);
    
    group.add(topShelf, midShelf);

    // --- Create Front Pillars for Upper Section ---
    const frontPillarHeight = DESK_HEIGHT - deskY;
    const frontPillarY = deskY + frontPillarHeight / 2;
    const frontPillarZ = -DESK_DEPTH + monitorShelfDepth - FRAME_THICKNESS / 2;

    const createFrontPillar = (sign) => {
        const pillar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, frontPillarHeight, FRAME_THICKNESS),
            material
        );
        const xPos = sign * (DESK_WIDTH / 2 - FRAME_THICKNESS / 2);
        pillar.position.set(xPos, frontPillarY, frontPillarZ);
        return pillar;
    };
    group.add(createFrontPillar(1), createFrontPillar(-1));

    // Restore the upper walls between monitor shelf and top shelf.
    const topShelfY = DESK_HEIGHT - BOARD_THICKNESS / 2;
    const upperWallHeight = topShelfY - midShelfY;
    const upperWallGeo = new THREE.BoxGeometry(FRAME_THICKNESS, upperWallHeight, monitorShelfDepth);
    const upperWallL = new THREE.Mesh(upperWallGeo, material);
    upperWallL.position.set(-(DESK_WIDTH / 2 - FRAME_THICKNESS / 2), midShelfY + upperWallHeight / 2, -DESK_DEPTH + monitorShelfDepth / 2);
    const upperWallR = new THREE.Mesh(upperWallGeo, material);
    upperWallR.position.set(DESK_WIDTH / 2 - FRAME_THICKNESS / 2, midShelfY + upperWallHeight / 2, -DESK_DEPTH + monitorShelfDepth / 2);
    group.add(upperWallL, upperWallR);
    
    const mainDeskWidth = DESK_WIDTH;
    const deskCutoutWidth = 0.5; // Width of the cutout on the main desk surface
    const legroomWidth = 0.75;    // Width of the space for legs underneath
    const cutoutDepth = 0.15;

    // --- Main Desk Pieces (uses deskCutoutWidth) ---
    const sidePieceWidth = (mainDeskWidth - deskCutoutWidth) / 2;
    const deskBackPiece = new THREE.Mesh(new THREE.BoxGeometry(mainDeskWidth, BOARD_THICKNESS, DESK_DEPTH - cutoutDepth), material);
    deskBackPiece.position.set(0, deskY, - (cutoutDepth + (DESK_DEPTH - cutoutDepth)/2) );
    const deskLeftPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskLeftPiece.position.set( - (deskCutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);
    const deskRightPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskRightPiece.position.set( (deskCutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);
    group.add(deskBackPiece, deskLeftPiece, deskRightPiece);

    // --- New Front Frame and Bottom Shelves (uses legroomWidth) ---
    const beamZ = -cutoutDepth - FRAME_THICKNESS;
    const beamY = deskY - BOARD_THICKNESS / 2 - FRAME_THICKNESS / 2;
    const beam = new THREE.Mesh(
        new THREE.BoxGeometry(mainDeskWidth, FRAME_THICKNESS, FRAME_THICKNESS),
        material
    );
    beam.position.set(0, beamY, beamZ);
    group.add(beam);

    // --- Create a matching beam for the back of the main desk ---
    const rearDeskBeam = new THREE.Mesh(
        new THREE.BoxGeometry(DESK_WIDTH, FRAME_THICKNESS, FRAME_THICKNESS),
        material
    );
    // Position it symmetrically to the front beam, along the back edge.
    const rearDeskBeamZ = -DESK_DEPTH + FRAME_THICKNESS / 2;
    rearDeskBeam.position.set(0, beamY, rearDeskBeamZ);
    group.add(rearDeskBeam);

    // --- Define dimensions for pillars and shelves (uses legroomWidth) ---
    const pillarHeight = deskY - 0.05; // From beam down to the floor (y=0)
    const pillarY = pillarHeight / 2;  // Center of the pillar

    const bottomShelfDepth = (monitorShelfDepth + DESK_DEPTH) / 2;
    const bottomShelfWidth = (DESK_WIDTH - legroomWidth) / 2 - FRAME_THICKNESS;

    // --- Create Pillars (now on the outside of shelves, uses legroomWidth) ---
    const createPillar = (side) => {
        const pillar = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, pillarHeight, FRAME_THICKNESS),
            material
        );
        // Position the pillar at the *outer* edge of where the bottom shelf will be
        const pillarX = side * (legroomWidth / 2 + bottomShelfWidth + FRAME_THICKNESS / 2);
        pillar.position.set(pillarX, pillarY, beamZ);
        return pillar;
    };
    const pillarL = createPillar(-1);
    const pillarR = createPillar(1);
    group.add(pillarL, pillarR);
    
    // --- Create a new beam to support the inner-back of the bottom shelves ---
    const rearBottomBeam = new THREE.Mesh(
        new THREE.BoxGeometry(legroomWidth, FRAME_THICKNESS_2, FRAME_THICKNESS_2),
        material
    );
    // Position the beam based on the user's tested preference.
    // This formula is a simplification of the user's version, preserving the exact result.
    const shelfBottomY = bottomShelfY - BOARD_THICKNESS / 2;
    const rearBottomBeamY = shelfBottomY + FRAME_THICKNESS_2 / 2;
    const rearBottomBeamZ = -DESK_DEPTH + FRAME_THICKNESS_2 / 2;
    rearBottomBeam.position.set(0, rearBottomBeamY, rearBottomBeamZ);
    group.add(rearBottomBeam);

    // --- Create Bottom Shelves (uses legroomWidth) ---
    const createBottomShelf = (side) => {
        const shelfGroup = new THREE.Group();
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(bottomShelfWidth, BOARD_THICKNESS, bottomShelfDepth),
            material
        );
        const shelfX = side * (legroomWidth / 2 + bottomShelfWidth / 2);
        shelf.position.set(shelfX, bottomShelfY, -DESK_DEPTH + bottomShelfDepth / 2);
        
        // Add the low side-guard panel
        const sideGuardHeight = 0.2;
        const sideGuard = new THREE.Mesh(
            new THREE.BoxGeometry(FRAME_THICKNESS, sideGuardHeight, bottomShelfDepth),
            material
        );
        const sideGuardX = side * (legroomWidth / 2 + bottomShelfWidth + FRAME_THICKNESS / 2);
        sideGuard.position.set(sideGuardX, bottomShelfY + sideGuardHeight / 2, -DESK_DEPTH + bottomShelfDepth / 2);

        shelfGroup.add(shelf, sideGuard);
        return shelfGroup;
    };

    const bottomShelfL = createBottomShelf(-1);
    const bottomShelfR = createBottomShelf(1);
    group.add(bottomShelfL, bottomShelfR);
    
    return group;
}