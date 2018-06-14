const Alexa = require('ask-sdk-core');
const http = require('http');

function httpGet(options) {
  return new Promise(((resolve, reject) => {

    const request = http.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
      }

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    request.on('error', function (error) {
      reject(error);
    });

    request.end();
  }));
}

const LightHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'LightIntent');
  },
  handle(handlerInput) {
    var intent = handlerInput.requestEnvelope.request.intent;

    var options = {
      host: "thorestla.ddns.net",
      port: 1809,
      path: "/alexa/zwave/skillID/"+intent.slots.state.value+"/light/0",
      method: "GET"
    };

    return new Promise((resolve, reject) => {
     httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response.msg).getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak(error.toString()).getResponse());
      });
    });
  },
}

const RollerShutterCloseHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'RollerShutterCloseIntent');
  },
  handle(handlerInput) {
    var options = {
      host: "thorestla.ddns.net",
      port: 1809,
      path: "/alexa/zwave/skillID/alterValue/volet/0",
      method: "GET"
    };

    return new Promise((resolve, reject) => {
     httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response.msg).getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak(error.toString()).getResponse());
      });
    });
  },
};

const RollerShutterOpenHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'RollerShutterOpenIntent');
  },
  handle(handlerInput) {
    var options = {
      host: "thorestla.ddns.net",
      port: 1809,
      path: "/alexa/zwave/skillID/alterValue/volet/99",
      method: "GET"
    };

    return new Promise((resolve, reject) => {
     httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response.msg).getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak(error.toString()).getResponse());
      });
    });
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    RollerShutterCloseHandler,
    RollerShutterOpenHandler,
    LightHandler
  ).lambda();
