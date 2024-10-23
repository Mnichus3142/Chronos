# Setup wiki
1. Open "src/connectionParameters.json"
2. Enter data used for connection (don't worry if you don't have SSL certificate, just leave this field blank)
3. [Create Database](database/scheme.md)

| Run locally (dev) | Run locally (build) | Run in docker* |
| ------------- | ------------- | ------------- |
| 1. cd to app dir | 1. npm run build | (sudo) docker build . -t timerush |
| 2. npm run dev | 2. 🚧WIP🚧 | (sudo) docker run -p 4173:4173 |

*Currently docker is running npm run build and then npm run previev