FROM  mhart/alpine-node:8.11.4

EXPOSE 3000:3000

ENV PORT=3000
ENV MONGODB_URL=mongodb://localhost:27017/dockertest
ENV JWT_SECRET=ad2342555öfjasdfjköa23452345sdljfkökasd45422342234fjöjghhgurtiqowbvyxncvmr857629465244

COPY . .

RUN npm i 

CMD ["npm", "run", "start"]