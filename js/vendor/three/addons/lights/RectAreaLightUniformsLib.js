import { Vector3 } from 'three';

const RectAreaLightUniformsLib = {

	init: function () {

		const UniformsCache = new Map();

		const lights = [
			{
				type: 'RectAreaLight',
				position: new Vector3(),
				color: new Vector3(),
				distance: 0,
				width: 0,
				height: 0,
				lookAt: new Vector3()
			}
		];

		function getUniforms( light ) {

			if ( UniformsCache.has( light ) ) {

				const uniforms = UniformsCache.get( light );
				uniforms.value = pack( lights, uniforms.value );
				return uniforms;

			}

			// This is a simplified version for a single light
			const uniforms = {
				value: pack( lights, new Float32Array( 15 ) ),
				properties: {
					position: {},
					color: {},
					distance: {},
					width: {},
					height: {},
					lookAt: {}
				}
			};

			UniformsCache.set( light, uniforms );

			return uniforms;

		}

		function pack( lights, array ) {

			const l = lights[ 0 ];

			l.position.toArray( array, 0 );
			l.color.toArray( array, 3 );
			array[ 6 ] = l.distance;
			array[ 7 ] = l.width;
			array[ 8 ] = l.height;
			l.lookAt.toArray( array, 9 );

			return array;

		}

		// Patch the RectAreaLight class
		if (THREE.RectAreaLight) {
			THREE.RectAreaLight.getUniforms = getUniforms;
		}
	}
};


function patchThree() {
    if (self.THREE && self.THREE.RectAreaLight) {
        const _init = RectAreaLightUniformsLib.init;
        RectAreaLightUniformsLib.init = function() {
             if (self.THREE.RectAreaLight.getUniforms === undefined) {
                _init();
            }
        };
    }
}

// The original init function tries to modify a global THREE object,
// which doesn't exist in a module environment.
// We need to import the THREE object and patch it carefully.
// This is a workaround for the module compatibility issue.

import * as THREE from 'three';

patchThree();


export { RectAreaLightUniformsLib };