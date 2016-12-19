

WORKDIR /home/bpm/api



# Install Mean.JS packages
ADD package.json /home/bpm/api/package.json
RUN npm install


# Make everything available for start
ADD . /home/bpm/api

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729

CMD [ "npm", "start" ]