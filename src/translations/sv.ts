import { Translations } from './types';

export const sv: Translations = {
  // Auth related
  'welcome.back': 'Välkommen tillbaka',
  'sign.in': 'Logga in på ditt konto',
  'signing.in': 'Loggar in...',
  'no.account': 'Har du inget konto?',
  'register': 'Kom igång',
  'email': 'E-post',
  'password': 'Lösenord',
  'new.password': 'Nytt lösenord',
  'email.placeholder': 'Ange din e-postadress',
  'password.placeholder': 'Ange ditt lösenord',
  'new.password.placeholder': 'Ange nytt lösenord',
  'phone.placeholder': 'Ange telefonnummer',
  'token.placeholder': 'Ange verifieringskod',
  'dark.mode': 'Mörkt läge',
  'light.mode': 'Ljust läge',
  'forgot.password': 'Glömt ditt lösenord?',
  'send.recovery.link': 'Skicka återställningslänk',
  'sending.recovery.link': 'Skickar återställningslänk...',
  'update.password': 'Uppdatera lösenord',
  'updating.password': 'Uppdaterar lösenord...',
  'cancel': 'Avbryt',
  'loading': 'Laddar...',
  'reset.password': 'Återställ lösenord',
  'reset.password.success': 'Återställningslänk har skickats',
  'password.updated': 'Lösenordet har uppdaterats',
  // Navigation
  'nav.home': 'Hem',
  'nav.checklist': 'Checklista',
  'nav.my.links': 'Mina länkar',
  'nav.address.alerts': 'Adresslarm',
  'nav.guides': 'Guider',
  'nav.admin.dashboard': 'Dashboard',
  'nav.admin.customers': 'Kunder',
  // Profile menu
  'profile.manage': 'Hantera profil',
  'profile.billing': 'Prenumeration',
  'profile.settings': 'Inställningar',
  'profile.sign.out': 'Logga ut',
  'profile.signing.out': 'Loggar ut...',
  // Search
  'search.placeholder': 'Sök...',
  'search.no.results': 'Inga sökresultat hittades.',
  'search.category.pages': 'Sidor',
  'search.category.settings': 'Inställningar',
  // Footer links
  'privacy': 'Integritet',
  'license': 'Licensvillkor',
  'terms': 'Användarvillkor',
  // Page titles
  'overview.title': 'Översikt',
  'overview.welcome': 'Välkommen till din översikt.',
  // Error messages
  'error': 'Fel',
  'error.title': 'Fel',
  'error.invalid.credentials': 'Felaktigt användarnamn eller lösenord',
  'error.current.password': 'Nuvarande lösenord är felaktigt',
  'error.email.not.confirmed': 'Vänligen bekräfta din e-postadress innan du loggar in',
  'error.user.not.found': 'Ingen användare hittades med dessa uppgifter',
  'error.invalid.email.password': 'Ogiltig e-postadress eller lösenord',
  'error.missing.email.phone': 'E-postadress eller telefonnummer saknas',
  'error.missing.password': 'Lösenord saknas',
  'error.password.too.short': 'Lösenordet måste vara minst 6 tecken',
  'error.email.taken': 'E-postadressen används redan',
  'error.phone.taken': 'Telefonnumret används redan',
  'error.weak.password': 'Lösenordet är för svagt',
  'error.invalid.email': 'Ogiltig e-postadress',
  'error.invalid.phone': 'Ogiltigt telefonnummer',
  'error.generic': 'Ett fel uppstod. Försök igen senare.',
  'error.signin': 'Fel vid inloggning',
  'error.signout': 'Fel vid utloggning',
  'error.password.update': 'Fel vid uppdatering av lösenord',
  'error.missing.email': 'Vänligen ange din e-postadress',
  'error.invalid.recovery.link': 'Ogiltig eller utgången återställningslänk',
  'error.password.requirements': 'Se till att ditt lösenord uppfyller alla krav',
  'error.update.preferences': 'Det gick inte att uppdatera notifikationsinställningarna',
  'error.invalidFileType': 'Ogiltig filtyp. Vänligen ladda upp en bild.',
  'error.fileTooLarge': 'Filen är för stor. Maximal storlek är 5MB.',
  'error.avatarUpload': 'Det gick inte att ladda upp avataren.',
  'error.passwords.dont.match': 'Lösenorden matchar inte',
  // Toast messages
  'toast.signed.out.title': 'Du har loggats ut',
  'toast.signed.out.description': 'Du har loggats ut från ditt konto.',
  'toast.error.title': 'Fel',
  'toast.error.description': 'Kunde inte logga ut. Försök igen.',
  'toast.error.unexpected': 'Ett oväntat fel uppstod. Försök igen.',
  'toast.copied.title': 'Kopierat',
  'toast.copied.description': 'Meddelandet har kopierats till urklipp',
  // Table related
  'table.userId': 'UID',
  'table.email': 'E-post',
  'table.role': 'Roll',
  'table.created': 'Skapad',
  'table.subscription': 'Prenumeration',
  'table.actions': 'Åtgärder',
  // Settings related
  'settings.change.password': 'Byt lösenord',
  'settings.current.password': 'Nuvarande lösenord',
  'settings.new.password': 'Nytt lösenord',
  'settings.confirm.password': 'Bekräfta nytt lösenord',
  'settings.update.password': 'Uppdatera lösenord',
  'settings.updating.password': 'Uppdaterar lösenord...',
  'settings.success': 'Klart',
  'settings.password.updated': 'Lösenordet har uppdaterats',
  'settings.notification.preferences': 'Notifikationsinställningar',
  'settings.email.notifications': 'E-postnotifikationer',
  'settings.email.notifications.description': 'Få viktiga uppdateringar och varningar via e-post',
  'settings.inapp.notifications': 'App-notifikationer',
  'settings.inapp.notifications.description': 'Få notifikationer inom applikationen',
  'settings.notifications.updated': 'Notifikationsinställningar har uppdaterats',
  // Notifications
  'notifications.title': 'Notiser',
  'notifications': 'Notiser',
  'notifications.mark.all.read': 'Markera alla som lästa',
  'notifications.empty': 'Inga notifieringar',
  // UI elements
  'messages': 'Meddelanden',
  'copy': 'Kopiera',
  // Step related translations
  'step.number': 'Steg {number}',
  'step.progress': 'Steg {current} av {total}',
  'step.password.title': 'Ange lösenord',
  'step.password.description': 'Skapa ett säkert lösenord för ditt konto',
  'step.sites.title': 'Välj webbplatser',
  'step.sites.description': 'Välj vilka webbplatser du vill dölja din information från',
  'step.urls.title': 'Skicka in URL:er',
  'step.urls.description': 'Skicka in URL:er där din information visas',
  'step.info.title': 'Personlig information',
  'step.info.description': 'Uppdatera din personliga information',
  'step.1.title': 'Ange lösenord',
  'step.2.title': 'Välj webbplatser',
  'step.3.title': 'Skicka in URL:er',
  'step.4.title': 'Personlig information',
  // Password related
  'set.password': 'Ange lösenord',
  'set.password.description': 'Skapa ett säkert lösenord för ditt konto',
  'current.password': 'Nuvarande lösenord',
  // Status messages
  'success': 'Klart',
  'completed': 'Slutförd',
  'pending.completion': 'Väntar på slutförande',
  // Checklist related
  'checklist': 'Checklista',
  'getting.started': 'Kom igång',
  // Links
  'link.to.removal': 'Länk till borttagningssida',
  // Guide related translations
  'guide.eniro.title': 'Eniro',
  'guide.eniro.step1': 'Besök https://www.eniro.se/person/removal',
  'guide.eniro.step2': 'Fyll i dina personuppgifter',
  'guide.eniro.step3': 'Skicka in formuläret',
  'guide.eniro.step4': 'Vänta på bekräftelse',
  
  'guide.mrkoll.title': 'Mrkoll',
  'guide.mrkoll.step1': 'Besök https://www.mrkoll.se/person/removal',
  'guide.mrkoll.step2': 'Ange dina uppgifter',
  'guide.mrkoll.step3': 'Skicka begäran',
  
  'guide.hitta.title': 'Hitta.se',
  'guide.hitta.step1': 'Besök https://www.hitta.se/removal',
  'guide.hitta.step2': 'Fyll i formuläret',
  'guide.hitta.step3': 'Skicka och vänta',
  
  'guide.merinfo.title': 'Merinfo',
  'guide.merinfo.step1': 'Gå till https://www.merinfo.se/removal',
  'guide.merinfo.step2': 'Följ borttagningsprocessen',
  
  'guide.ratsit.title': 'Ratsit',
  'guide.ratsit.step1': 'Besök https://www.ratsit.se/removal',
  'guide.ratsit.step2': 'Fyll i borttagningsformuläret',
  'guide.ratsit.step3': 'Skicka begäran',
  
  'guide.birthday.title': 'Birthday',
  'guide.birthday.step1': 'Besök webbplatsen',
  'guide.birthday.step2': 'Skicka meddelande: "Vänligen ta bort min information"',
  'guide.birthday.step3': 'Vänta på bekräftelse',
  
  'guide.upplysning.title': 'Upplysning',
  'guide.upplysning.step1': 'Gå till webbplatsen',
  'guide.upplysning.step2': 'Skicka borttagningsbegäran',
  'guide.upplysning.step3': 'Vänta på svar',

  // Add subscription translations
  'subscription.1month': '1 Månads Plan',
  'subscription.6months': '6 Månaders Plan',
  'subscription.12months': '12 Månaders Plan',
  'subscription.none': 'Ingen Plan'
} as const;
