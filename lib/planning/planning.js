const Agenda = require('agenda');
const ical = require('node-ical');
const fetch = require('node-fetch');

const Planning = (() => {
  let agenda, agendaUrl;

  const setup = (dbUrl, url) => {
    if (!agenda) agenda = new Agenda({ db: { address: dbUrl } });
    agendaUrl = url;
    setTimeout(async () => {
      await fetchURL();
    }, 500);
  };

  const fetchURL = async () => {
    const webEvents = await ical.async.fromURL(agendaUrl);
    console.log(webEvents);
  };

  return {
    setup,
  };
})();

module.exports = {
  Planning,
};
