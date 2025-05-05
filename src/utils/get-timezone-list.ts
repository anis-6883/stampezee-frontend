import moment from 'moment-timezone';

const timeZoneData = moment.tz.names()?.map((tz: string) => ({
  value: tz,
  label: tz,
}));

export default timeZoneData;

// [
//   {
//     value: -5,
//     label: 'America/Toronto (-5)',
//   },
//   {
//     value: -4,
//     label: 'America/Toronto (-4)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Dhaka (+6)',
//   },
// ]
// const timeZoneData = [
//   {
//     value: -12,
//     label: 'Etc/GMT (-12)',
//   },
//   {
//     value: -11,
//     label: 'Etc/GMT (-11)',
//   },
//   {
//     value: -11,
//     label: 'Pacific/Midway (-11)',
//   },
//   {
//     value: -11,
//     label: 'Pacific/Niue (-11)',
//   },
//   {
//     value: -11,
//     label: 'Pacific/Pago_Pago (-11)',
//   },
//   {
//     value: -10,
//     label: 'Etc/GMT+10 (-10)',
//   },
//   {
//     value: -10,
//     label: 'Pacific/Honolulu (-10)',
//   },
//   {
//     value: -10,
//     label: 'Pacific/Johnston (-10)',
//   },
//   {
//     value: -10,
//     label: 'Pacific/Rarotonga (-10)',
//   },
//   {
//     value: -10,
//     label: 'Pacific/Tahiti (-10)',
//   },
//   {
//     value: -8,
//     label: 'America/Anchorage (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Juneau (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Nome (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Sitka (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Yakutat (-8)',
//   },
//   {
//     value: -7,
//     label: 'America/Santa_Isabel (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Los_Angeles (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Tijuana (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Vancouver (-7)',
//   },
//   {
//     value: -8,
//     label: 'America/Los_Angeles (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Tijuana (-8)',
//   },
//   {
//     value: -8,
//     label: 'America/Vancouver (-8)',
//   },
//   {
//     value: -8,
//     label: 'PST8PDT (-8)',
//   },
//   {
//     value: -7,
//     label: 'America/Creston (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Dawson (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Dawson_Creek (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Hermosillo (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Phoenix (-7)',
//   },
//   {
//     value: -7,
//     label: 'America/Whitehorse (-7)',
//   },
//   {
//     value: -7,
//     label: 'Etc/GMT+7 (-7)',
//   },
//   {
//     value: -6,
//     label: 'America/Chihuahua (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Mazatlan (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Boise (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Cambridge_Bay (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Denver (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Edmonton (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Inuvik (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Ojinaga (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Yellowknife (-6)',
//   },
//   {
//     value: -6,
//     label: 'MST7MDT (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Belize (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Costa_Rica (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/El_Salvador (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Guatemala (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Managua (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Tegucigalpa (-6)',
//   },
//   {
//     value: -6,
//     label: 'Etc/GMT+6 (-6)',
//   },
//   {
//     value: -6,
//     label: 'Pacific/Galapagos (-6)',
//   },
//   {
//     value: -5,
//     label: 'America/Chicago (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Knox (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Tell_City (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Matamoros (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Menominee (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/North_Dakota/Beulah (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/North_Dakota/Center (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/North_Dakota/New_Salem (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Rainy_River (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Rankin_Inlet (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Resolute (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Winnipeg (-5)',
//   },
//   {
//     value: -5,
//     label: 'CST6CDT (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Bahia_Banderas (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Cancun (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Merida (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Mexico_City (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Monterrey (-5)',
//   },
//   {
//     value: -6,
//     label: 'America/Regina (-6)',
//   },
//   {
//     value: -6,
//     label: 'America/Swift_Current (-6)',
//   },
//   {
//     value: -5,
//     label: 'America/Bogota (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Cayman (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Coral_Harbour (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Eirunepe (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Guayaquil (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Jamaica (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Lima (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Panama (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Rio_Branco (-5)',
//   },
//   {
//     value: -5,
//     label: 'Etc/GMT+5 (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Detroit (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Havana (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Petersburg (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Vincennes (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Winamac (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Iqaluit (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Kentucky/Monticello (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Louisville (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Montreal (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Nassau (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/New_York (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Nipigon (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Pangnirtung (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Port-au-Prince (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Thunder_Bay (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Toronto (-5)',
//   },
//   {
//     value: -4,
//     label: 'America/Detroit (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Havana (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Indiana/Petersburg (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Indiana/Vincennes (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Indiana/Winamac (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Iqaluit (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Kentucky/Monticello (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Louisville (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Montreal (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Nassau (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/New_York (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Nipigon (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Pangnirtung (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Port-au-Prince (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Thunder_Bay (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Toronto (-4)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Marengo (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indiana/Vevay (-5)',
//   },
//   {
//     value: -5,
//     label: 'America/Indianapolis (-5)',
//   },
//   {
//     value: -4.5,
//     label: 'America/Caracas (-4.5)',
//   },
//   {
//     value: -4,
//     label: 'America/Asuncion (-4)',
//   },
//   {
//     value: -3,
//     label: 'America/Glace_Bay (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Goose_Bay (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Halifax (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Moncton (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Thule (-3)',
//   },
//   {
//     value: -3,
//     label: 'Atlantic/Bermuda (-3)',
//   },
//   {
//     value: -4,
//     label: 'America/Campo_Grande (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Cuiaba (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Anguilla (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Antigua (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Aruba (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Barbados (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Blanc-Sablon (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Boa_Vista (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Curacao (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Dominica (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Grand_Turk (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Grenada (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Guadeloupe (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Guyana (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Kralendijk (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/La_Paz (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Lower_Princes (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Manaus (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Marigot (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Martinique (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Montserrat (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Port_of_Spain (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Porto_Velho (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Puerto_Rico (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Santo_Domingo (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/St_Barthelemy (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/St_Kitts (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/St_Lucia (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/St_Thomas (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/St_Vincent (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Tortola (-4)',
//   },
//   {
//     value: -4,
//     label: 'Etc/GMT+4 (-4)',
//   },
//   {
//     value: -4,
//     label: 'America/Santiago (-4)',
//   },
//   {
//     value: -4,
//     label: 'Antarctica/Palmer (-4)',
//   },
//   {
//     value: -2.5,
//     label: 'America/St_Johns (-2.5)',
//   },
//   {
//     value: -3,
//     label: 'America/Sao_Paulo (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Buenos_Aires (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Catamarca (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Cordoba (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Jujuy (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/La_Rioja (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Mendoza (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Rio_Gallegos (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Salta (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/San_Juan (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/San_Luis (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Tucuman (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Argentina/Ushuaia (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Buenos_Aires (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Catamarca (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Cordoba (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Jujuy (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Mendoza (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Araguaina (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Belem (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Cayenne (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Fortaleza (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Maceio (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Paramaribo (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Recife (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Santarem (-3)',
//   },
//   {
//     value: -3,
//     label: 'Antarctica/Rothera (-3)',
//   },
//   {
//     value: -3,
//     label: 'Atlantic/Stanley (-3)',
//   },
//   {
//     value: -3,
//     label: 'Etc/GMT+3 (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Godthab (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Montevideo (-3)',
//   },
//   {
//     value: -3,
//     label: 'America/Bahia (-3)',
//   },
//   {
//     value: -2,
//     label: 'America/Noronha (-2)',
//   },
//   {
//     value: -2,
//     label: 'Atlantic/South_Georgia (-2)',
//   },
//   {
//     value: -2,
//     label: 'Etc/GMT+2 (-2)',
//   },
//   {
//     value: 0,
//     label: 'America/Scoresbysund (0)',
//   },
//   {
//     value: 0,
//     label: 'Atlantic/Azores (0)',
//   },
//   {
//     value: -1,
//     label: 'Atlantic/Cape_Verde (-1)',
//   },
//   {
//     value: -1,
//     label: 'Etc/GMT+1 (-1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Casablanca (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/El_Aaiun (+1)',
//   },
//   {
//     value: 0,
//     label: 'America/Danmarkshavn (0)',
//   },
//   {
//     value: 0,
//     label: 'Etc/GMT (0)',
//   },
//   {
//     value: 0,
//     label: 'Europe/Isle_of_Man (0)',
//   },
//   {
//     value: 0,
//     label: 'Europe/Guernsey (0)',
//   },
//   {
//     value: 0,
//     label: 'Europe/Jersey (0)',
//   },
//   {
//     value: 0,
//     label: 'Europe/London (0)',
//   },
//   {
//     value: 1,
//     label: 'Europe/Isle_of_Man (+1)',
//   },
//   {
//     value: 1,
//     label: 'Europe/Guernsey (+1)',
//   },
//   {
//     value: 1,
//     label: 'Europe/Jersey (+1)',
//   },
//   {
//     value: 1,
//     label: 'Europe/London (+1)',
//   },
//   {
//     value: 1,
//     label: 'Atlantic/Canary (+1)',
//   },
//   {
//     value: 1,
//     label: 'Atlantic/Faeroe (+1)',
//   },
//   {
//     value: 1,
//     label: 'Atlantic/Madeira (+1)',
//   },
//   {
//     value: 1,
//     label: 'Europe/Dublin (+1)',
//   },
//   {
//     value: 1,
//     label: 'Europe/Lisbon (+1)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Abidjan (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Accra (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Bamako (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Banjul (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Bissau (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Conakry (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Dakar (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Freetown (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Lome (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Monrovia (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Nouakchott (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Ouagadougou (0)',
//   },
//   {
//     value: 0,
//     label: 'Africa/Sao_Tome (0)',
//   },
//   {
//     value: 0,
//     label: 'Atlantic/Reykjavik (0)',
//   },
//   {
//     value: 0,
//     label: 'Atlantic/St_Helena (0)',
//   },
//   {
//     value: 2,
//     label: 'Arctic/Longyearbyen (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Amsterdam (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Andorra (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Berlin (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Busingen (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Gibraltar (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Luxembourg (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Malta (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Monaco (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Oslo (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Rome (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/San_Marino (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Stockholm (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Vaduz (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Vatican (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Vienna (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Zurich (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Belgrade (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Bratislava (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Budapest (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Ljubljana (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Podgorica (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Prague (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Tirane (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Ceuta (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Brussels (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Copenhagen (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Madrid (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Paris (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Sarajevo (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Skopje (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Warsaw (+2)',
//   },
//   {
//     value: 2,
//     label: 'Europe/Zagreb (+2)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Algiers (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Bangui (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Brazzaville (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Douala (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Kinshasa (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Lagos (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Libreville (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Luanda (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Malabo (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Ndjamena (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Niamey (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Porto-Novo (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Tunis (+1)',
//   },
//   {
//     value: 1,
//     label: 'Etc/GMT-1 (+1)',
//   },
//   {
//     value: 1,
//     label: 'Africa/Windhoek (+1)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Nicosia (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Athens (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Bucharest (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Chisinau (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Beirut (+3)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Cairo (+2)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Damascus (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Nicosia (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Athens (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Bucharest (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Chisinau (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Helsinki (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Kiev (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Mariehamn (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Nicosia (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Riga (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Sofia (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Tallinn (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Uzhgorod (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Vilnius (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Zaporozhye (+3)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Blantyre (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Bujumbura (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Gaborone (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Harare (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Johannesburg (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Kigali (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Lubumbashi (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Lusaka (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Maputo (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Maseru (+2)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Mbabane (+2)',
//   },
//   {
//     value: 2,
//     label: 'Etc/GMT-2 (+2)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Helsinki (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Kiev (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Mariehamn (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Riga (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Sofia (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Tallinn (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Uzhgorod (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Vilnius (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Zaporozhye (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Istanbul (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Jerusalem (+3)',
//   },
//   {
//     value: 2,
//     label: 'Africa/Tripoli (+2)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Amman (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Baghdad (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Kaliningrad (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Aden (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Bahrain (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Kuwait (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Qatar (+3)',
//   },
//   {
//     value: 3,
//     label: 'Asia/Riyadh (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Addis_Ababa (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Asmera (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Dar_es_Salaam (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Djibouti (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Juba (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Kampala (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Khartoum (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Mogadishu (+3)',
//   },
//   {
//     value: 3,
//     label: 'Africa/Nairobi (+3)',
//   },
//   {
//     value: 3,
//     label: 'Antarctica/Syowa (+3)',
//   },
//   {
//     value: 3,
//     label: 'Etc/GMT-3 (+3)',
//   },
//   {
//     value: 3,
//     label: 'Indian/Antananarivo (+3)',
//   },
//   {
//     value: 3,
//     label: 'Indian/Comoro (+3)',
//   },
//   {
//     value: 3,
//     label: 'Indian/Mayotte (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Kirov (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Moscow (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Simferopol (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Volgograd (+3)',
//   },
//   {
//     value: 3,
//     label: 'Europe/Minsk (+3)',
//   },
//   {
//     value: 4,
//     label: 'Europe/Astrakhan (+4)',
//   },
//   {
//     value: 4,
//     label: 'Europe/Samara (+4)',
//   },
//   {
//     value: 4,
//     label: 'Europe/Ulyanovsk (+4)',
//   },
//   {
//     value: 4.5,
//     label: 'Asia/Tehran (+4.5)',
//   },
//   {
//     value: 4,
//     label: 'Asia/Dubai (+4)',
//   },
//   {
//     value: 4,
//     label: 'Asia/Muscat (+4)',
//   },
//   {
//     value: 4,
//     label: 'Etc/GMT (+4)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Baku (+5)',
//   },
//   {
//     value: 4,
//     label: 'Indian/Mahe (+4)',
//   },
//   {
//     value: 4,
//     label: 'Indian/Mauritius (+4)',
//   },
//   {
//     value: 4,
//     label: 'Indian/Reunion (+4)',
//   },
//   {
//     value: 4,
//     label: 'Asia/Tbilisi (+4)',
//   },
//   {
//     value: 4,
//     label: 'Asia/Yerevan (+4)',
//   },
//   {
//     value: 4.5,
//     label: 'Asia/Kabul (+4.5)',
//   },
//   {
//     value: 5,
//     label: 'Antarctica/Mawson (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Aqtau (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Aqtobe (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Ashgabat (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Dushanbe (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Oral (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Samarkand (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Tashkent (+5)',
//   },
//   {
//     value: 5,
//     label: 'Etc/GMT (+5)',
//   },
//   {
//     value: 5,
//     label: 'Indian/Kerguelen (+5)',
//   },
//   {
//     value: 5,
//     label: 'Indian/Maldives (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Yekaterinburg (+5)',
//   },
//   {
//     value: 5,
//     label: 'Asia/Karachi (+5)',
//   },
//   {
//     value: 5.5,
//     label: 'Asia/Kolkata (+5.5)',
//   },
//   {
//     value: 5.5,
//     label: 'Asia/Calcutta (+5.5)',
//   },
//   {
//     value: 5.5,
//     label: 'Asia/Colombo (+5.5)',
//   },
//   {
//     value: 5.75,
//     label: 'Asia/Kathmandu (+5.75)',
//   },
//   {
//     value: 6,
//     label: 'Antarctica/Vostok (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Almaty (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Bishkek (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Qyzylorda (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Urumqi (+6)',
//   },
//   {
//     value: 6,
//     label: 'Etc/GMT-6 (+6)',
//   },
//   {
//     value: 6,
//     label: 'Indian/Chagos (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Dhaka (+6)',
//   },
//   {
//     value: 6,
//     label: 'Asia/Thimphu (+6)',
//   },
//   {
//     value: 6.5,
//     label: 'Asia/Rangoon (+6.5)',
//   },
//   {
//     value: 6.5,
//     label: 'Indian/Cocos (+6.5)',
//   },
//   {
//     value: 7,
//     label: 'Antarctica/Davis (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Bangkok (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Hovd (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Jakarta (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Phnom_Penh (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Pontianak (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Saigon (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Vientiane (+7)',
//   },
//   {
//     value: 7,
//     label: 'Etc/GMT-7 (+7)',
//   },
//   {
//     value: 7,
//     label: 'Indian/Christmas (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Novokuznetsk (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Novosibirsk (+7)',
//   },
//   {
//     value: 7,
//     label: 'Asia/Omsk (+7)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Hong_Kong (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Macau (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Shanghai (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Krasnoyarsk (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Brunei (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Kuala_Lumpur (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Kuching (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Makassar (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Manila (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Singapore (+8)',
//   },
//   {
//     value: 8,
//     label: 'Etc/GMT (+8)',
//   },
//   {
//     value: 8,
//     label: 'Antarctica/Casey (+8)',
//   },
//   {
//     value: 8,
//     label: 'Australia/Perth (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Taipei (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Choibalsan (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Ulaanbaatar (+8)',
//   },
//   {
//     value: 8,
//     label: 'Asia/Irkutsk (+8)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Dili (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Jayapura (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Tokyo (+9)',
//   },
//   {
//     value: 9,
//     label: 'Etc/GMT (+9)',
//   },
//   {
//     value: 9,
//     label: 'Pacific/Palau (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Pyongyang (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Seoul (+9)',
//   },
//   {
//     value: 9.5,
//     label: 'Australia/Adelaide (+9.5)',
//   },
//   {
//     value: 9.5,
//     label: 'Australia/Broken_Hill (+9.5)',
//   },
//   {
//     value: 9.5,
//     label: 'Australia/Darwin (+9.5)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Brisbane (+10)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Lindeman (+10)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Melbourne (+10)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Sydney (+10)',
//   },
//   {
//     value: 10,
//     label: 'Antarctica/DumontDUrville (+10)',
//   },
//   {
//     value: 10,
//     label: 'Etc/GMT (+10)',
//   },
//   {
//     value: 10,
//     label: 'Pacific/Guam (+10)',
//   },
//   {
//     value: 10,
//     label: 'Pacific/Port_Moresby (+10)',
//   },
//   {
//     value: 10,
//     label: 'Pacific/Saipan (+10)',
//   },
//   {
//     value: 10,
//     label: 'Pacific/Truk (+10)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Currie (+10)',
//   },
//   {
//     value: 10,
//     label: 'Australia/Hobart (+10)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Chita (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Khandyga (+9)',
//   },
//   {
//     value: 9,
//     label: 'Asia/Yakutsk (+9)',
//   },
//   {
//     value: 11,
//     label: 'Antarctica/Macquarie (+11)',
//   },
//   {
//     value: 11,
//     label: 'Etc/GMT (+11)',
//   },
//   {
//     value: 11,
//     label: 'Pacific/Efate (+11)',
//   },
//   {
//     value: 11,
//     label: 'Pacific/Guadalcanal (+11)',
//   },
//   {
//     value: 11,
//     label: 'Pacific/Kosrae (+11)',
//   },
//   {
//     value: 11,
//     label: 'Pacific/Noumea (+11)',
//   },
//   {
//     value: 11,
//     label: 'Pacific/Ponape (+11)',
//   },
//   {
//     value: 11,
//     label: 'Asia/Sakhalin (+11)',
//   },
//   {
//     value: 11,
//     label: 'Asia/Ust-Nera (+11)',
//   },
//   {
//     value: 11,
//     label: 'Asia/Vladivostok (+11)',
//   },
//   {
//     value: 12,
//     label: 'Antarctica/McMurdo (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Auckland (+12)',
//   },
//   {
//     value: 12,
//     label: 'Etc/GMT (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Funafuti (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Kwajalein (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Majuro (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Nauru (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Tarawa (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Wake (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Wallis (+12)',
//   },
//   {
//     value: 12,
//     label: 'Pacific/Fiji (+12)',
//   },
//   {
//     value: 12,
//     label: 'Asia/Anadyr (+12)',
//   },
//   {
//     value: 12,
//     label: 'Asia/Kamchatka (+12)',
//   },
//   {
//     value: 12,
//     label: 'Asia/Magadan (+12)',
//   },
//   {
//     value: 12,
//     label: 'Asia/Srednekolymsk (+12)',
//   },
//   {
//     value: 13,
//     label: 'Asia/Kamchatka (+13)',
//   },
//   {
//     value: 13,
//     label: 'Etc/GMT (+13)',
//   },
//   {
//     value: 13,
//     label: 'Pacific/Enderbury (+13)',
//   },
//   {
//     value: 13,
//     label: 'Pacific/Fakaofo (+13)',
//   },
//   {
//     value: 13,
//     label: 'Pacific/Tongatapu (+13)',
//   },
//   {
//     value: 13,
//     label: 'Pacific/Apia (+13)',
//   },
// ];
