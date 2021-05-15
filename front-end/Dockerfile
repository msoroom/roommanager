FROM  node:14



EXPOSE 3000:3000

ENV PROXY=http://10.20.0.3:3001

ADD . .

RUN npm i 

CMD ["npm", "start"]