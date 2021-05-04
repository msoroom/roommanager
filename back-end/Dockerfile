FROM  node:14

RUN apt-get update || : && apt-get install python -y
RUN apt-get install python3-pip -y

EXPOSE 3000:3000

ENV PORT=3000
ENV MONGODB_URL=mongodb://localhost:27017/dockertest
ENV JWT_SECRET=ad2342555öfjasdfjköa23452345sdljfkökasd45422342234fjöjghhgurtiqowbvyxncvmr857629465244

ADD  . .

RUN npm i 

CMD ["npm", "run", "start"]