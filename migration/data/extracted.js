/**
 * One-time extraction snapshot from `geko-kinderpraxis` → Strapi-oriented payloads (no filesystem reads at runtime).
 */

/** Canonical contact/meta for Strapi `kipra-meta` (localized; same prose in DE/EN). */
export const META = Object.freeze({
	company: 'Berghafenpraxis',
	street: 'Rollbergstraße 30',
	postal: '12053',
	city: 'Berlin',
	phone: '+49 30 33953131',
	fax: '+49 30 7001431430',
	email: 'kindergesundheit@posteo.de',
});

/** Jekyll `_pages/de/privacy.md` body; liquid resolved with {@link META}. */
export const PRIVACY_BODY_DE = `
Datenschutz Stand: 12. Dezember 2021

1. **Verantwortliche Person:** Dr. Lothar Müller, ${META.street}, ${META.postal} ${META.city}
Telefon: ${META.phone}
E-Mail: ${META.email}

2. **Übersicht der Verarbeitungen:** Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.
Arten der verarbeiteten Daten Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos). Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen). Kategorien betroffener Personen Nutzer:innen (z.B. Webseitenbesucher:innen, Nutzer:innen von Onlinediensten).

3. **Maßgebliche Rechtsgrundlagen:** Im Folgenden teilen wir die Rechtsgrundlagen der Datenschutzgrundverordnung (DSGVO), auf deren Basis wir die personenbezogenen Daten verarbeiten, mit. Bitte beachten Sie, dass zusätzlich zu den Regelungen der DSGVO die nationalen Datenschutzvorgaben in Ihrem bzw. unserem Wohn- und Sitzland gelten können.
Dein Klickverhalten oder Eingaben (z.B. Angaben zu deinem Einkommen im Kapitel Leistbarkeit) werden nicht gespeichert. Unser Hoster erhebt jedoch Zugriffsstatistiken und speichert deshalb für maximal 30 Tage deine IP Adresse.
Nationale Datenschutzregelungen in Deutschland: Zusätzlich zu den Datenschutzregelungen der Datenschutz-Grundverordnung gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Des Weiteren regelt es die Datenverarbeitung für Zwecke des Beschäftigungsverhältnisses (§ 26 BDSG), insbesondere im Hinblick auf die Begründung, Durchführung oder Beendigung von Beschäftigungsverhältnissen sowie die Einwilligung von Beschäftigten. Ferner können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.

4. **Sicherheitsmaßnahmen:** Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.
Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
SSL-Verschlüsselung (https) Um Deine via unser Online-Angebot übermittelten Daten zu schützen, nutzen wir eine SSL-Verschlüsselung. Sie erkennen derart verschlüsselte Verbindungen an dem Präfix https:// in der Adresszeile Ihres Browsers.
Erstellt mit Datenschutz-Generator.de von Dr. jur. Thomas Schwenke`.trim();

/**
 * `_pages/en/privacy.md`: legalese kept; §1 rewired from legacy template placeholders to `{@link META}`.
 */
export const PRIVACY_BODY_EN = `
Data protection Status: December 12, 2021

1. **Responsible:** Dr Lothar Müller, ${META.street}, ${META.postal} ${META.city}
Phone: ${META.phone}
E-mail: ${META.email}

2. **Overview of processing operations:** The following overview summarizes the types of data processed and the purposes of their processing, and refers to the data subjects.
Types of data processed Content data (e.g. text input, photographs, videos). Meta/communication data (e.g., device information, IP addresses). Categories of data subjects User:s (e.g., website visitors, users of online services).

3. **Relevant legal basis:** In the following, we share the legal basis of the Data Protection Regulation (GDPR) on the basis of which we process the personal data. Please note that in addition to the regulations of the DSGVO, the national data protection regulations in your or our country of residence and domicile may apply.
Your click behavior or inputs (e.g. information about your income in the affordability chapter) are not stored. However, our hoster collects access statistics and therefore stores your IP address for a maximum of 30 days.
National data protection regulations in Germany: In addition to the data protection regulations of the General Data Protection Regulation, national data protection regulations apply in Germany. These include, in particular, the Act on Protection against Misuse of Personal Data in Data Processing (Federal Data Protection Act - BDSG). In particular, the BDSG contains special regulations on the right to information, the right to erasure, the right to object, the processing of special categories of personal data, processing for other purposes and transmission, as well as automated decision-making in individual cases, including profiling. Furthermore, it regulates data processing for employment purposes (Section 26 BDSG), in particular with regard to the establishment, implementation or termination of employment relationships as well as the consent of employees. Furthermore, state data protection laws of the individual federal states may apply.

4. **Security measures:** We take appropriate technical and organizational measures in accordance with the legal requirements, taking into account the state of the art, the implementation costs and the nature, scope, circumstances and purposes of the processing, as well as the different probabilities of occurrence and the extent of the threat to the rights and freedoms of natural persons, in order to ensure a level of protection appropriate to the risk.
The measures include, in particular, safeguarding the confidentiality, integrity and availability of data by controlling physical and electronic access to the data as well as access to, input of, disclosure of, assurance of availability of and segregation of the data. Furthermore, we have established procedures to ensure the exercise of data subjects' rights, the deletion of data, and responses to data compromise. Furthermore, we already take the protection of personal data into account during the development or selection of hardware, software as well as procedures in accordance with the principle of data protection, through technology design and through data protection-friendly default settings.
SSL encryption (https) To protect your data transmitted via our online offer, we use SSL encryption. You can recognize such encrypted connections by the prefix https:// in the address bar of your browser.

Created with Datenschutz-Generator.de by Dr. jur. Thomas Schwenke

Translated with www.DeepL.com/Translator (free version)`.trim();

export const PRIVACY_TITLE = Object.freeze({
	de: 'Datenschutzerklärung',
	en: 'Privacy statement',
});

/**
 * Notification files under `_notifications/` (same basename DE/EN) merged; YAML type wichtig → is_urgent false.
 */
export const ANNOUNCEMENT_TITLE = Object.freeze({
	de: 'Diverses',
	en: 'Practice notices',
});

export const ANNOUNCEMENT_BODY_DE = `
Am Brückentag Freitag, den 15. Mai, bleibt die Praxis geschlossen.

Am Mittwoch, den 27.5. ist die Praxis nachmittags geschlossen.
Am Mittwoch, den 3. Juni ist die Praxis ganztägig geschlossen.

Wir nehmen aktuell keine Neupatientinnen und Neupatienten auf, außer Neugeborene und Geschwisterkinder.

[Elternberatungsangebot](/assets/img/20250101_elterngruppe_therapie_flyer-a5.pdf) zu Entwicklung und Gesundheit: Dienstag 10–12 Uhr für Eltern von 0–5-jährigen Kindern.

Wir können 2026 **keine** Famulantinnen/Famulanten oder Praktikantinnen/Praktikanten mehr aufnehmen.`.trim();

export const ANNOUNCEMENT_BODY_EN = `
The practice remains closed Friday 15 May (bridge day).

Wednesday 27 May closed in the afternoon; Wednesday 3 June closed all day.

We are currently not enrolling new patients (except newborns and sibling children).

[Parent counselling offer](/assets/img/20250101_elterngruppe_therapie_flyer-a5.pdf) on development and health: Tuesdays from 10:00 to 12:00 for parents of children aged 0–5.

We cannot accommodate medical electives / internships for 2026.`.trim();

/**
 * Personnel (no images). Strapi **`kipra-personnels`** is not localized — **`position`** is German only.
 *
 * basename `map-description-…johanna-henatsch` in Jekyll actually lists Lothar; Johanna Henatsch added from site context (`Über uns` / referral practice).
 */
export const PERSONNEL = Object.freeze([
	{
		first_name: 'Lothar',
		last_name: 'Müller',
		position: 'Facharzt für Kinder- und Jugendmedizin',
	},
	{
		first_name: 'Eva',
		last_name: 'Feuerhahn',
		position: 'Fachärztin für Kinder- und Jugendmedizin',
	},
	{
		first_name: 'Laura',
		last_name: 'Schlemmer',
		position: 'Fachärztin für Kinder- und Jugendmedizin',
	},
	{
		first_name: 'Lena',
		last_name: 'Wirth',
		position: 'Fachärztin für Kinder- und Jugendmedizin',
	},
	{
		first_name: 'Jonathan',
		last_name: 'Zepp',
		position:
			'Facharzt für Kinder- und Jugendmedizin, Neonatologe (Hospitations-/Famulaturanfragen: j.zepp@berghafenpraxis.de)',
	},
	{
		first_name: 'Johanna',
		last_name: 'Henatsch',
		position: 'Fachärztin für Innere Medizin',
	},
	{
		first_name: 'Ayça',
		last_name: '-',
		position: 'Medizinische Fachangestellte',
	},
	{
		first_name: 'Carlos',
		last_name: '-',
		position: 'Krankenpfleger',
	},
	{
		first_name: 'David',
		last_name: '-',
		position: 'Praxisassistenz',
	},
	{
		first_name: 'Emmanuel',
		last_name: '-',
		position: 'Praxisassistenz',
	},
	{
		first_name: 'Gesine',
		last_name: '-',
		position: 'Praxisorganisation',
	},
	{
		first_name: 'Grazia',
		last_name: '-',
		position: 'Kinderkrankenpflegerin und Heilpädagogin',
	},
	{
		first_name: 'Idriz',
		last_name: '-',
		position: 'Medizinischer Fachangestellter',
	},
	{
		first_name: 'Jo',
		last_name: '-',
		position: 'Medizinische Fachangestellte',
	},
	{
		first_name: 'Lea',
		last_name: '-',
		position: 'Auszubildende',
	},
	{
		first_name: 'Marei',
		last_name: '-',
		position: 'Ärztin in Weiterbildung',
	},
	{
		first_name: 'Raisa',
		last_name: '-',
		position: 'Auszubildende',
	},
	{
		first_name: 'Paul',
		last_name: '-',
		position: 'Arzt in Weiterbildung',
	},
	{
		first_name: 'Wahiba',
		last_name: '-',
		position: 'Kinderkrankenschwester',
	},
]);

export const ANNOUNCEMENT_IS_URGENT = false;
