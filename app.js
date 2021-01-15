var express = require('express');
var app = express();
app.use(express.json());
const axios = require('axios');
const mediumURL = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@"
const devURL = "https://dev.to/api/articles?username="
const { blogCardH, blogCardV } = require('./MediumblogCard');
const { DblogCardH, DblogCardV } = require('./DevblogCard');

const getMediumData = async (username) => {
  try {
    const result = await axios.get(mediumURL + username)
    const filteredResult = result.data.items.filter(function (item) {
      if (!item.thumbnail.includes('stat?event') || !item.thumbnail.includes('&referrerSource')) {
        return true
      } else {
        return false
      }
    });
    return filteredResult;
  } catch (error) {
    console.error(error);
    return error
  }
}
const getDevData = async (username) => {
  try {
    const result = await axios.get(devURL + username)
    const filteredResult = result.data
    // .items.filter(function (item) {
    //   if (!item.thumbnail.includes('stat?event') || !item.thumbnail.includes('&referrerSource')) {
    //     return true
    //   } else {
    //     return false
    //   }
    // });
    return filteredResult;
  } catch (error) {
    console.error(error);
    return error
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};

app.get('/getMediumBlogs', async (request, response) => {
  try {
    if (!request.query.username) {
      response.write(JSON.stringify({ error: 'your medium username is require in the query string' }));
      response.end();
      return;
    }
    const username = request.query.username;
    let limit = 5;
    let type = 'vertical'
    if (request.query.type) {
      type = request.query.type;
    }
    if (request.query.limit) {
      limit = request.query.limit;
    }
    const resultData = (await getMediumData(username));
    let result = `<svg>`;
    if (type === 'horizontal') {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${resultData.length * 200}" version="1.2" height="310">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCardH(blog);
        result += `<g transform="translate(${index * 200}, 0)">${blogCardObj}</g>`;
      });
    } else {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" version="1.2" height="${resultData.length * 160}">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCardV(blog);
        result += `<g transform="translate(0, ${index * 160})">${blogCardObj}</g>`;
      });
    }
    result += `</svg>`;
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.write(result);
    response.end();
  } catch (error) {
    console.log(error);
    response.send('Error while fetching the data' + error);
  }
});

app.get('/getDevBlogs', async (request, response) => {
  try {
    if (!request.query.username) {
      response.write(JSON.stringify({ error: 'your medium username is require in the query string' }));
      response.end();
      return;
    }
    const username = request.query.username;
    let limit = 5;
    let type = 'vertical'
    if (request.query.type) {
      type = request.query.type;
    }
    if (request.query.limit) {
      limit = request.query.limit;
    }
    const resultData = (await getDevData(username));
    let result = `<svg>`;
    if (type === 'horizontal') {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${resultData.length * 200}" version="1.2" height="310">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await DblogCardH(blog);
        result += `<g transform="translate(${index * 200}, 0)">${blogCardObj}</g>`;
      });
    } else {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" version="1.2" height="${resultData.length * 160}">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await DblogCardV(blog);
        result += `<g transform="translate(0, ${index * 160})">${blogCardObj}</g>`;
      });
    }
    result += `</svg>`;
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.write(result);
    response.end();
  } catch (error) {
    console.log(error);
    response.send('Error while fetching the data' + error);
  }
});

app.get('/getMediumBlogsByID', async (request, response) => {
  try {
    if (!request.query.username) {
      response.write(JSON.stringify({ error: 'your medium username is require in the query string' }));
      response.end();
      return;
    }
    const username = request.query.username;
    let limit = 5;
    let type = 'vertical'
    if (request.query.type) {
      type = request.query.type;
    }
    if (request.query.limit) {
      limit = request.query.limit;
    }
    let data = (await getMediumData(username));
    const resultData = [];
    resultData.push(data[request.query.id])
    let result = `<svg>`;
    if (type === 'horizontal') {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${resultData.length * 200}" version="1.2" height="310">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCardH(blog);
        result += `<g transform="translate(${index * 200}, 0)">${blogCardObj}</g>`;
      });
    } else {
      result = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" version="1.2" height="${resultData.length * 160}">`;
      await asyncForEach(resultData, async (blog, index) => {
        if (index >= limit) {
          return;
        }
        const blogCardObj = await blogCardV(blog);
        result += `<g transform="translate(0, ${index * 160})">${blogCardObj}</g>`;
      });
    }
    result += `</svg>`;
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.write(result);
    response.end();
  } catch (error) {
    console.log(error);
    response.send('Error while fetching the data' + error);
  }
});

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server listening ' + port);
}); 
