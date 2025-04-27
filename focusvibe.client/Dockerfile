FROM node:22.11.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

ENV PORT=5130

EXPOSE 5130

CMD ["npx", "vite", "preview"]