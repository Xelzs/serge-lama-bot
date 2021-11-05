const Agenda = require('agenda');
const { MessageEmbed } = require('discord.js');
const ical = require('node-ical');
const dayjs = require('dayjs');
require('dayjs/locale/fr');

const Planning = (() => {
  let agenda, agendaUrl, channel;

  const setup = async (ch) => {
    if (!agenda) agenda = new Agenda({ db: { address: process.env.DB_URL } });
    agendaUrl = process.env.AGENDA_URL;
    channel = ch;

    agenda.define('send to discord', sendToDiscord);
    agenda.define('fetch url', fetchURL);

    await agenda.start();

    await agenda.every('0 3 * * *', 'fetch url');
    await agenda.now('fetch url');
  };

  const graceful = async () => {
    await agenda.stop();
    process.exit(0);
  };

  const fetchURL = async () => {
    const webEvents = await ical.async.fromURL(agendaUrl);
    const events = await formatEvents(webEvents);
    console.debug(`Got ${events.length} new events`);
    setupEvents(events);
  };

  const extractDetail = (event) => {
    const descSplitted = event.description.val.split('\n');

    if (descSplitted.length > 1) {
      let txt = `${descSplitted[0]}\n${descSplitted[1]}`;
      if (descSplitted[0].split(':')[1].trim() !== 'Ydays') txt += `\nSalle: ${event.location.val}`;
      return txt;
    }
    return `${event.description.val}\nSalle: ${event.location.val}`;
  };

  const getRegisteredEvents = async () => {
    const jobs = await agenda.jobs({ name: 'send to discord' }, { data: 1 });
    return jobs.map((j) => j.attrs.data.event);
  };

  const formatEvents = async (events) => {
    const now = Date.now();
    const registeredEvents = await getRegisteredEvents();

    return Object.keys(events)
      .filter((ev) => events.hasOwnProperty(ev) && events[ev].type === 'VEVENT')
      .map((ev) => events[ev])
      .filter((event) => {
        return (
          event.start.getTime() > now &&
          event.summary.val !== 'Férié' &&
          !registeredEvents.some((ev) => dayjs(event.start).isSame(dayjs(ev.name)))
        );
      })
      .map((event) => ({
        name: event.start,
        value: extractDetail(event),
        inline: true,
      }));
  };

  const formatDiscordEmbed = ({ name, value, inline }) => {
    const embed = new MessageEmbed();
    return embed
      .setTitle('Cours :')
      .addField(dayjs(name).locale('fr').format('dddd D MMMM - H:m'), value, inline)
      .setImage(`https://loremflickr.com/320/240/lama,animal/all?dumbid=${Date.now()}`)
      .setColor('#28D1E7')
      .setFooter(
        'Developed by Axel SIMONET',
        'https://files.axelsimonet.fr/api/public/dl/aUMXn2A_/xelzs/logoA-small.png'
      );
  };

  const setupEvents = async (events) => {
    events.forEach(async (ev) => {
      const date = dayjs(ev.name).locale('fr').subtract(20, 'minutes').format();
      await agenda.schedule(date, 'send to discord', { event: ev });
    });
  };

  const sendToDiscord = async (job) => {
    const { event } = job.attrs.data;
    const embed = formatDiscordEmbed(event);

    channel.send({ embeds: [embed] });
  };

  const refresh = async () => {
    await agenda.now('fetch url');
  };

  const next = async () => {
    const events = await Planning.getRegisteredEvents();
    return formatDiscordEmbed(events[0]);
  };

  return {
    setup,
    getRegisteredEvents,
    refresh,
    graceful,
    next,
  };
})();

module.exports = {
  Planning,
};
