FROM  node:alpine
EXPOSE 3000:3000

RUN apt-get update || : && apt-get install python -y


ADD . .

RUN npm i 

CMD ["npm", "start"]