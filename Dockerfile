FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src/ ./src/

EXPOSE 7860

ENV PORT=7860

CMD ["node", "src/index.js"]
