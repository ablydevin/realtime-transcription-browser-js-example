// required dom elements
const buttonEl = document.getElementById("button");
const messageEl = document.getElementById("message");
const titleEl = document.getElementById("real-time-title");

// set initial state of application variables
let socket;

// runs real-time transcription and handles global variables
const run = async () => {
  const client = new Ably.Realtime.Promise({ authUrl: 'http://localhost:8000/auth' });
  await client.connection.once('connected');
  console.log('Connected to Ably!');
  const texts = {};

  const channel = client.channels.get('closed-captions');
  channel.subscribe((message) => {
    //console.log(message.data)
    let msg = "";
    const res = JSON.parse(message.data);
    texts[res.audio_start] = res.text;
    const keys = Object.keys(texts);
    keys.sort((a, b) => a - b);
    for (const key of keys) {
      if (texts[key]) {
        //console.log(texts[key])
        msg += ` ${texts[key]}`;
      }
    }
    //console.log(msg)    
    messageEl.innerText = msg;
  })
};

buttonEl.addEventListener("click", () => run());
