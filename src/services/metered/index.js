const url = "https://maruyama.metered.live/api/v1/turn/credentials?apiKey=9e107671cf3dbaff24820519c367bba8fad6";

export default {
    listICEServers: () => {
        return fetch(url);
    }
}
