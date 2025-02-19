const colors = {
    // ? For some reason, third color is used for text somewhere


    // Light themes
    "North Coast": {
        primary: "#0D1B2A",
        secondary: "#354253",
        third: "#8E9BAF",
        accent: "#14A684",
        accentNotActive: "#808080",
        background: "#fff",
        textColor: "#fff",
        textInvertedColor: "#0D1B2A",
        mottoColor: "#e9c882",
    },
    "Vintage Elegance": {
        primary: "#49392c",
        secondary: "#77625c",
        third: "#b2b1cf",
        accent: "#00c9ad",
        accentNotActive: "#402e32",
        background: "#fff8f0",
        textColor: "#dfe0df",
        textInvertedColor: "#000",
        mottoColor: "#b2b1cf",
    },
    "Whispering Leaves": {
        primary: "#1b512d",
        secondary: "#1c7c54",
        third: "#b1cf5f",
        accent: "#004522",
        accentNotActive: "#402e32",
        background: "#fff8f0",
        textColor: "#dfe0df",
        textInvertedColor: "#000",
        mottoColor: "#a7c46e",
    }
}

export const themes = Object.keys(colors);
export default colors;