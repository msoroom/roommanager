FROM  node:14

EXPOSE 3000:3000

RUN apt-get update && apt-get install -y --no-install-recommends python3.5 python3-pip

ENV PORT=3001
ENV MONGODB_URL=mongodb://10.20.0.1:27017/dockertest
ENV JWT_SECRET=ad2342555öfjasdfjköa23452345sdljfkökasd45422342234fjöjghhgurtiqowbvyxncvmr857629465244



COPY . .

RUN npm i 

CMD ["npm", "run", "start"]