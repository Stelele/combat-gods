// vite.config.mts
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import { AssetPack } from '@assetpack/core';
import { pixiPipes } from '@assetpack/core/pixi'

function assetpackPlugin(): Plugin {
    const apConfig = {
        entry: './raw-assets',
        pipes: [
            ...pixiPipes({
                texturePacker: {
                    resolutionOptions: {
                        maximumTextureSize: 65536,
                        resolutions: { low: 0.4 },
                        fixedResolution: "low",
                    }
                },
                compression: {
                    png: { quality: 95 }
                }
            })
        ],
    };

    let mode: ResolvedConfig['command'];
    let ap: AssetPack | undefined;

    return {
        name: 'vite-plugin-assetpack',
        configResolved(resolvedConfig) {
            mode = resolvedConfig.command;
            if (!resolvedConfig.publicDir) return;
            if (apConfig.output) return;
            const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '');
            apConfig.output = `${publicDir}/assets/`;
        },
        buildStart: async () => {
            if (mode === 'serve') {
                if (ap) return;
                ap = new AssetPack(apConfig);
                void ap.watch();
            } else {
                await new AssetPack(apConfig).run();
            }
        },
        buildEnd: async () => {
            if (ap) {
                await ap.stop();
                ap = undefined;
            }
        },
    }
}

export default defineConfig({
    plugins: [
        assetpackPlugin(),
    ],
})