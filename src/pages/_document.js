import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return ( <
            Html lang = "id" > { " " } { /* Menambahkan atribut lang */ } { " " } <
            Head > { " " } { /* Script Alpine.js */ } { " " } <
            script src = "https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
            defer /
            >
            <
            link rel = "icon"
            href = "/images/neper.png" / >
            <
            /Head>{" "} <
            body >
            <
            Main / >
            <
            NextScript / >
            <
            /body>{" "} <
            /Html>
        );
    }
}

export default MyDocument;