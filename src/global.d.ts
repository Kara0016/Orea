declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            GUILD_ID: string;
            SPOTIFY_ID: string;
            SPOTIFY_SECRET: string;
        }
    }
}
export {};