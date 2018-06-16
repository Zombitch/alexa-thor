const Alexa = require('ask-sdk-core');
const httpHelper = require("./helpers/httpHelper");

const LightHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'LightIntent');
  },
  handle(handlerInput) {
    var intent = handlerInput.requestEnvelope.request.intent;
    var percentageValue = typeof intent.slots.percentage.value == "undefined" ? 99 : intent.slots.percentage.value;
    var transcodedValue = intent.slots.state.value.includes("allumer") ? percentageValue : 0;
    var homeLocation = typeof intent.slots.homeLocation.value == "undefined" ? "null" : intent.slots.homeLocation.value;

    var options = {
      host: "thorestla.ddns.net",
      port: 1809,
      path: "/alexa/zwave/skillID/"+encodeURIComponent("lumière")+"/"+encodeURIComponent(homeLocation)+"/"+transcodedValue,
      method: "GET"
    };

    return new Promise((resolve, reject) => {
     httpHelper.getData(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response.msg).getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak(error.toString()).getResponse());
      });
    });
  },
}

const RollerShutterHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'RollerShutterIntent');
  },
  handle(handlerInput) {
    var intent = handlerInput.requestEnvelope.request.intent;
    var percentageValue = 0;

    if(intent.slots.rollerState.value.includes("ouvrir")){
      if(typeof intent.slots.percentage.value != "undefined") percentageValue = intent.slots.percentage.value;
      else percentageValue = 99;
    }else{
      if(typeof intent.slots.percentage.value != "undefined") percentageValue = 100-intent.slots.percentage.value;
      else percentageValue = 0;
    }

    if(percentageValue > 100) percentageValue = 99;

    var options = {
      host: "thorestla.ddns.net",
      port: 1809,
      path: "/alexa/zwave/skillID/volet/null/"+percentageValue,
      method: "GET"
    };

    return new Promise((resolve, reject) => {
     httpHelper.getData(options).then((response) => {
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
    RollerShutterHandler,
    LightHandler
  ).lambda();
