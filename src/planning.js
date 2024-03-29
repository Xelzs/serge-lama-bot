const Agenda = require('agenda');
const { EmbedBuilder } = require('discord.js');
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

    await agenda.every('0 */4 * * *', 'fetch url');
    await agenda.now('fetch url');
  };

  const graceful = async () => {
    await agenda.stop();
    process.exit(0);
  };

  const fetchURL = async () => {
    const webEvents = await ical.async.fromURL(agendaUrl);
    const events = await formatEvents(webEvents);
    await setupEvents(events);
    console.debug(`Got ${events.length} new events`);
  };

  const extractDetail = (event) => {
    const result = { value: '', location: null };
    if (!event.description) return result;
    const descSplitted = event.description.val.split('\n');

    if (descSplitted.length > 1) {
      let txt = `${descSplitted[0]}\n${descSplitted[1]}`;

      if (event.location) {
        txt += `\nSalle : ${event.location.val}`;
        result.location = event.location.val;
      }

      result.value = txt;
    } else {
      result.value = event.description.val;

      if (event.location) result.value += `\nSalle : ${event.location.val}`;
    }

    return result;
  };

  const getRegisteredEvents = async () => {
    const jobs = await agenda.jobs({ name: 'send to discord' }, { data: 1 });
    return jobs.map((j) => j.attrs.data.event);
  };

  const formatEvents = async (events) => {
    const now = Date.now();
    await agenda.cancel({ name: 'send to discord' });

    try {
      return Object.keys(events)
        .filter((ev) => events.hasOwnProperty(ev) && events[ev].type === 'VEVENT')
        .map((ev) => events[ev])
        .filter(
          (event) =>
            event.start.getTime() > now && event.summary.val !== 'Férié' && !event.summary.val.includes('Ydays')
        )
        .map((event) => {
          return {
            name: event.start,
            value: extractDetail(event),
            inline: true,
          };
        });
    } catch (error) {
      console.error('err', error);
    }
  };

  const formatDiscordEmbed = ({ name, value, inline }) => {
    const embed = new EmbedBuilder();
    return embed
      .setTitle(value.location ? `Cours - ${value.location} :` : 'Cours :')
      .addFields({ name: dayjs(name).locale('fr').format('dddd D MMMM - H:m'), value: value.value, inline })
      .setImage(`https://loremflickr.com/320/240/lama,animal/all?dumbid=${Date.now()}`)
      .setColor('#28D1E7')
      .setFooter({
        text: 'Développé par Axel SIMONET',
        iconURL: 'https://avatars.githubusercontent.com/u/32241342?v=4',
      });
  };

  const setupEvents = async (events) => {
    await Promise.all(
      events.map(async (ev) => {
        const date = dayjs(ev.name).locale('fr').subtract(30, 'minutes').toDate();
        await agenda.schedule(date, 'send to discord', { event: ev });
      })
    );
  };

  const sendToDiscord = async (job) => {
    const { event } = job.attrs.data;
    const embed = formatDiscordEmbed(event);

    await channel.send({ embeds: [embed] });
  };

  const refresh = async () => {
    await agenda.now('fetch url');
  };

  const next = async () => {
    const events = await getRegisteredEvents();
    return formatDiscordEmbed(events[1]);
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
