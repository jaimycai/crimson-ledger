// Game Center texts that the app itself does not have (15 November 2026). The names and the "before" descriptions of
// the achievements that mirror a medal come from the medals in progress.js (Dutch) and i18n/<lang>.js, so Game Center
// says the same as the medal screen; spec.js puts it together. Here, per app language:
//   after    the "earned" description of those mirrored achievements; `world` gets the world's name for {w}
//   new      [name, before, after] of the achievements without a medal
//   names    (optional) a Game Center name instead of the medal title, where two medals share one title in that language
//   boards   points: [name, description, suffix singular, suffix plural]; daily_time: [name, description] (shown as a time)
// Words follow the language files: the daily case, quests, master level and streak are called what the app calls them.
// No word for murder in any language (Jaimy, 3 November 2026); store/metadata/check-1.6.js has the list, spec.js checks it.
// pt-PT is European Portuguese; spec.js also adapts the Brazilian medal texts for it.

module.exports = {
  nl: {
    after: {
      first_case: 'Je eerste zaak is opgelost.', first_part: 'Je hebt een heel deel van de campagne afgerond.',
      streak_3: 'Drie dagen achter elkaar de dagelijkse zaak gespeeld.', streak_7: 'Een week lang elke dag gespeeld.',
      case_of_week: 'Je hebt een zaak van de week opgelost.', world: 'Alle delen van {w} afgerond.'
    },
    new: {
      first_three_stars: ['Drie sterren', 'Haal drie sterren in een campagnezaak', 'Je eerste campagnezaak met drie sterren.'],
      streak_30: ['Dertig dagen op rij', 'Speel dertig dagen achter elkaar de dagelijkse zaak', 'Dertig dagen achter elkaar de dagelijkse zaak gespeeld.'],
      solved_10: ['Tien zaken', 'Los tien zaken op', 'Tien zaken opgelost.'],
      solved_50: ['Vijftig zaken', 'Los vijftig zaken op', 'Vijftig zaken opgelost.'],
      solved_100: ['Honderd zaken', 'Los honderd zaken op', 'Honderd zaken opgelost.'],
      solved_500: ['Vijfhonderd zaken', 'Los vijfhonderd zaken op', 'Vijfhonderd zaken opgelost: een vol grootboek.'],
      first_master: ['Meesterniveau', 'Los een zaak op meesterniveau op', 'Je eerste zaak op meesterniveau is opgelost.']
    },
    boards: {
      points: ['Totaal aantal punten', 'Alle punten die je verdient met zaken en opdrachten', 'punt', 'punten'],
      daily_time: ['Snelste dagelijkse zaak', 'Wie lost de zaak van vandaag het snelst op? Elke dag een nieuwe ranglijst.']
    }
  },
  en: {
    after: {
      first_case: 'You solved your first case.', first_part: 'You finished a whole part of the campaign.',
      streak_3: 'You played the daily case three days in a row.', streak_7: 'You played every day for a week.',
      case_of_week: 'You solved a case of the week.', world: 'You finished every part of {w}.'
    },
    new: {
      first_three_stars: ['Three Stars', 'Earn three stars in a campaign case', 'Your first campaign case with three stars.'],
      streak_30: ['Thirty Days Running', 'Play the daily case thirty days in a row', 'You played the daily case thirty days in a row.'],
      solved_10: ['Ten Cases', 'Solve ten cases', 'You solved ten cases.'],
      solved_50: ['Fifty Cases', 'Solve fifty cases', 'You solved fifty cases.'],
      solved_100: ['A Hundred Cases', 'Solve a hundred cases', 'You solved a hundred cases.'],
      solved_500: ['Five Hundred Cases', 'Solve five hundred cases', 'Five hundred cases solved: a full ledger.'],
      first_master: ['Master Level', 'Solve a case at master level', 'You solved your first master-level case.']
    },
    boards: {
      points: ['Total Points', 'Every point you earn with cases and daily quests', 'point', 'points'],
      daily_time: ['Fastest Daily Case', 'Who solves today’s case fastest? A new leaderboard every day.']
    }
  },
  de: {
    after: {
      first_case: 'Du hast deinen ersten Fall gelöst.', first_part: 'Du hast einen ganzen Teil der Kampagne abgeschlossen.',
      streak_3: 'Du hast den Tagesfall drei Tage hintereinander gespielt.', streak_7: 'Du hast eine Woche lang jeden Tag gespielt.',
      case_of_week: 'Du hast einen Fall der Woche gelöst.', world: '{w}: alle Teile abgeschlossen.'
    },
    new: {
      first_three_stars: ['Drei Sterne', 'Hol drei Sterne in einem Kampagnenfall', 'Dein erster Kampagnenfall mit drei Sternen.'],
      streak_30: ['Dreißig Tage in Folge', 'Spiele den Tagesfall dreißig Tage hintereinander', 'Du hast den Tagesfall dreißig Tage hintereinander gespielt.'],
      solved_10: ['Zehn Fälle', 'Löse zehn Fälle', 'Du hast zehn Fälle gelöst.'],
      solved_50: ['Fünfzig Fälle', 'Löse fünfzig Fälle', 'Du hast fünfzig Fälle gelöst.'],
      solved_100: ['Hundert Fälle', 'Löse hundert Fälle', 'Du hast hundert Fälle gelöst.'],
      solved_500: ['Fünfhundert Fälle', 'Löse fünfhundert Fälle', 'Fünfhundert Fälle gelöst: ein volles Hauptbuch.'],
      first_master: ['Meisterniveau', 'Löse einen Fall auf Meisterniveau', 'Du hast deinen ersten Fall auf Meisterniveau gelöst.']
    },
    boards: {
      points: ['Gesamtpunkte', 'Alle Punkte aus Fällen und Tagesaufträgen', 'Punkt', 'Punkte'],
      daily_time: ['Schnellster Tagesfall', 'Wer löst den heutigen Fall am schnellsten? Jeden Tag eine neue Rangliste.']
    }
  },
  fr: {
    after: {
      first_case: 'Tu as résolu ta première affaire.', first_part: 'Tu as terminé un chapitre entier de la campagne.',
      streak_3: 'Tu as joué l’affaire du jour trois jours de suite.', streak_7: 'Tu as joué chaque jour pendant une semaine.',
      case_of_week: 'Tu as résolu une affaire de la semaine.', world: '{w} : tous les chapitres terminés.'
    },
    new: {
      first_three_stars: ['Trois étoiles', 'Obtiens trois étoiles dans une affaire de la campagne', 'Ta première affaire de la campagne à trois étoiles.'],
      streak_30: ['Trente jours d’affilée', 'Joue l’affaire du jour trente jours de suite', 'Tu as joué l’affaire du jour trente jours de suite.'],
      solved_10: ['Dix affaires', 'Résous dix affaires', 'Tu as résolu dix affaires.'],
      solved_50: ['Cinquante affaires', 'Résous cinquante affaires', 'Tu as résolu cinquante affaires.'],
      solved_100: ['Cent affaires', 'Résous cent affaires', 'Tu as résolu cent affaires.'],
      solved_500: ['Cinq cents affaires', 'Résous cinq cents affaires', 'Cinq cents affaires résolues : un registre bien rempli.'],
      first_master: ['Niveau maître', 'Résous une affaire de niveau maître', 'Tu as résolu ta première affaire de niveau maître.']
    },
    boards: {
      points: ['Total des points', 'Tous les points gagnés avec les affaires et les missions du jour', 'point', 'points'],
      daily_time: ['Chrono de l’affaire du jour', 'Qui résout l’affaire du jour le plus vite ? Un nouveau classement chaque jour.']
    }
  },
  es: {
    // neutral for Spain and Mexico (one language file serves es-ES and es-MX)
    after: {
      first_case: 'Tu primer caso, resuelto.', first_part: 'Una parte entera de la campaña, terminada.',
      streak_3: 'El caso diario, tres días seguidos.', streak_7: 'Una semana entera jugando cada día.',
      case_of_week: 'Un caso de la semana, resuelto.', world: '{w}: todas las partes terminadas.'
    },
    new: {
      first_three_stars: ['Tres estrellas', 'Consigue tres estrellas en un caso de la campaña', 'Tu primer caso de la campaña con tres estrellas.'],
      streak_30: ['Treinta días seguidos', 'Juega el caso diario treinta días seguidos', 'Treinta días seguidos con el caso diario.'],
      solved_10: ['Diez casos', 'Resuelve diez casos', 'Diez casos resueltos.'],
      solved_50: ['Cincuenta casos', 'Resuelve cincuenta casos', 'Cincuenta casos resueltos.'],
      solved_100: ['Cien casos', 'Resuelve cien casos', 'Cien casos resueltos.'],
      solved_500: ['Quinientos casos', 'Resuelve quinientos casos', 'Quinientos casos resueltos: un libro de registro completo.'],
      first_master: ['Nivel maestro', 'Resuelve un caso de nivel maestro', 'Tu primer caso de nivel maestro, resuelto.']
    },
    boards: {
      points: ['Puntos totales', 'Todos los puntos que ganas con casos y retos diarios', 'punto', 'puntos'],
      daily_time: ['Caso diario más rápido', '¿Quién resuelve antes el caso de hoy? Una clasificación nueva cada día.']
    }
  },
  pt: {
    after: {
      first_case: 'Você resolveu seu primeiro caso.', first_part: 'Você terminou uma parte inteira da campanha.',
      streak_3: 'Você jogou o caso do dia três dias seguidos.', streak_7: 'Você jogou todos os dias durante uma semana.',
      case_of_week: 'Você resolveu um caso da semana.', world: '{w}: todas as partes concluídas.'
    },
    new: {
      first_three_stars: ['Três estrelas', 'Ganhe três estrelas em um caso da campanha', 'Seu primeiro caso da campanha com três estrelas.'],
      streak_30: ['Trinta dias seguidos', 'Jogue o caso do dia trinta dias seguidos', 'Você jogou o caso do dia trinta dias seguidos.'],
      solved_10: ['Dez casos', 'Resolva dez casos', 'Você resolveu dez casos.'],
      solved_50: ['Cinquenta casos', 'Resolva cinquenta casos', 'Você resolveu cinquenta casos.'],
      solved_100: ['Cem casos', 'Resolva cem casos', 'Você resolveu cem casos.'],
      solved_500: ['Quinhentos casos', 'Resolva quinhentos casos', 'Quinhentos casos resolvidos: um livro de registros completo.'],
      first_master: ['Nível Mestre', 'Resolva um caso no nível Mestre', 'Você resolveu seu primeiro caso no nível Mestre.']
    },
    boards: {
      points: ['Pontos totais', 'Todos os pontos que você ganha com casos e missões diárias', 'ponto', 'pontos'],
      daily_time: ['Caso do dia mais rápido', 'Quem resolve o caso de hoje mais rápido? Um novo ranking todo dia.']
    }
  },
  'pt-PT': {
    after: {
      first_case: 'Resolveste o teu primeiro caso.', first_part: 'Terminaste uma parte inteira da campanha.',
      streak_3: 'Jogaste o caso do dia três dias seguidos.', streak_7: 'Jogaste todos os dias durante uma semana.',
      case_of_week: 'Resolveste um caso da semana.', world: '{w}: todas as partes concluídas.'
    },
    new: {
      first_three_stars: ['Três estrelas', 'Ganha três estrelas num caso da campanha', 'O teu primeiro caso da campanha com três estrelas.'],
      streak_30: ['Trinta dias seguidos', 'Joga o caso do dia trinta dias seguidos', 'Jogaste o caso do dia trinta dias seguidos.'],
      solved_10: ['Dez casos', 'Resolve dez casos', 'Resolveste dez casos.'],
      solved_50: ['Cinquenta casos', 'Resolve cinquenta casos', 'Resolveste cinquenta casos.'],
      solved_100: ['Cem casos', 'Resolve cem casos', 'Resolveste cem casos.'],
      solved_500: ['Quinhentos casos', 'Resolve quinhentos casos', 'Quinhentos casos resolvidos: um livro de registos completo.'],
      first_master: ['Nível Mestre', 'Resolve um caso no nível Mestre', 'Resolveste o teu primeiro caso no nível Mestre.']
    },
    boards: {
      points: ['Pontos totais', 'Todos os pontos que ganhas com casos e missões diárias', 'ponto', 'pontos'],
      daily_time: ['Caso do dia mais rápido', 'Quem resolve o caso de hoje mais depressa? Uma nova classificação todos os dias.']
    }
  },
  it: {
    after: {
      first_case: 'Hai risolto il tuo primo caso.', first_part: 'Hai completato un’intera parte della campagna.',
      streak_3: 'Hai giocato il caso del giorno per tre giorni di fila.', streak_7: 'Hai giocato ogni giorno per una settimana.',
      case_of_week: 'Hai risolto un caso della settimana.', world: '{w}: tutte le parti completate.'
    },
    new: {
      first_three_stars: ['Tre stelle', 'Ottieni tre stelle in un caso della campagna', 'Il tuo primo caso della campagna con tre stelle.'],
      streak_30: ['Trenta giorni di fila', 'Gioca il caso del giorno per trenta giorni di fila', 'Hai giocato il caso del giorno per trenta giorni di fila.'],
      solved_10: ['Dieci casi', 'Risolvi dieci casi', 'Hai risolto dieci casi.'],
      solved_50: ['Cinquanta casi', 'Risolvi cinquanta casi', 'Hai risolto cinquanta casi.'],
      solved_100: ['Cento casi', 'Risolvi cento casi', 'Hai risolto cento casi.'],
      solved_500: ['Cinquecento casi', 'Risolvi cinquecento casi', 'Cinquecento casi risolti: un registro pieno.'],
      first_master: ['Livello maestro', 'Risolvi un caso di livello maestro', 'Hai risolto il tuo primo caso di livello maestro.']
    },
    boards: {
      points: ['Punti totali', 'Tutti i punti guadagnati con i casi e le sfide del giorno', 'punto', 'punti'],
      daily_time: ['Caso del giorno più veloce', 'Chi risolve per primo il caso di oggi? Una nuova classifica ogni giorno.']
    }
  },
  ja: {
    after: {
      first_case: '最初の事件を解決した。', first_part: 'キャンペーンの章を1つクリアした。',
      streak_3: '日替わり事件を3日続けてプレイした。', streak_7: '1週間、毎日プレイした。',
      case_of_week: '今週の事件を解決した。', world: '{w}の全章をクリアした。'
    },
    new: {
      first_three_stars: ['星3つ', 'キャンペーンの事件で星3つを獲得する', 'キャンペーンで初めて星3つを獲得した。'],
      streak_30: ['30日連続', '日替わり事件を30日続けてプレイする', '日替わり事件を30日続けてプレイした。'],
      solved_10: ['事件10件', '事件を10件解決する', '事件を10件解決した。'],
      solved_50: ['事件50件', '事件を50件解決する', '事件を50件解決した。'],
      solved_100: ['事件100件', '事件を100件解決する', '事件を100件解決した。'],
      solved_500: ['事件500件', '事件を500件解決する', '事件を500件解決した。台帳はもう満杯だ。'],
      first_master: ['達人級', '達人級の事件を解決する', '初めて達人級の事件を解決した。']
    },
    boards: {
      points: ['合計ポイント', '事件と今日の任務で獲得したすべてのポイント', 'ポイント', 'ポイント'],
      daily_time: ['日替わり事件の最速タイム', '今日の事件を一番早く解決するのは誰？ランキングは毎日新しくなります。']
    }
  },
  ko: {
    after: {
      first_case: '첫 사건을 해결했습니다.', first_part: '캠페인의 한 장을 끝냈습니다.',
      streak_3: '일일 사건을 3일 연속 플레이했습니다.', streak_7: '일주일 동안 매일 플레이했습니다.',
      case_of_week: '주간 사건을 해결했습니다.', world: '{w}의 모든 장을 끝냈습니다.'
    },
    new: {
      first_three_stars: ['별 세 개', '캠페인 사건에서 별 세 개를 받으세요', '캠페인 사건에서 처음으로 별 세 개를 받았습니다.'],
      streak_30: ['30일 연속', '일일 사건을 30일 연속 플레이하세요', '일일 사건을 30일 연속 플레이했습니다.'],
      solved_10: ['사건 10건', '사건 10건을 해결하세요', '사건 10건을 해결했습니다.'],
      solved_50: ['사건 50건', '사건 50건을 해결하세요', '사건 50건을 해결했습니다.'],
      solved_100: ['사건 100건', '사건 100건을 해결하세요', '사건 100건을 해결했습니다.'],
      solved_500: ['사건 500건', '사건 500건을 해결하세요', '사건 500건을 해결했습니다. 장부가 가득 찼습니다.'],
      first_master: ['마스터 난이도', '마스터 난이도 사건을 해결하세요', '마스터 난이도 사건을 처음으로 해결했습니다.']
    },
    boards: {
      points: ['총 포인트', '사건과 오늘의 미션으로 모은 모든 포인트', '포인트', '포인트'],
      daily_time: ['일일 사건 최단 기록', '오늘의 사건을 누가 가장 빨리 해결할까요? 순위표는 매일 새로 시작됩니다.']
    }
  },
  zh: {
    after: {
      first_case: '你破解了第一个案件。', first_part: '你完成了主线中的一整章。',
      streak_3: '你连续三天玩了每日案件。', streak_7: '你连续一周每天都在玩。',
      case_of_week: '你破解了一个每周案件。', world: '已完成{w}的所有章节。'
    },
    new: {
      first_three_stars: ['三颗星', '在主线案件中获得三颗星', '你第一次在主线案件中获得三颗星。'],
      streak_30: ['连续三十天', '连续三十天玩每日案件', '你连续三十天玩了每日案件。'],
      solved_10: ['十个案件', '破解十个案件', '你破解了十个案件。'],
      solved_50: ['五十个案件', '破解五十个案件', '你破解了五十个案件。'],
      solved_100: ['一百个案件', '破解一百个案件', '你破解了一百个案件。'],
      solved_500: ['五百个案件', '破解五百个案件', '你破解了五百个案件，账本已经写满。'],
      first_master: ['大师级', '破解一个大师级案件', '你破解了第一个大师级案件。']
    },
    boards: {
      points: ['总积分', '通过案件和今日任务获得的全部积分', '积分', '积分'],
      daily_time: ['每日案件最快纪录', '谁能最快破解今天的案件？排行榜每天更新。']
    }
  },
  ru: {
    after: {
      first_case: 'Первое дело раскрыто.', first_part: 'Пройдена целая часть кампании.',
      streak_3: 'Дело дня три дня подряд.', streak_7: 'Целую неделю каждый день.',
      case_of_week: 'Дело недели раскрыто.', world: 'Пройдены все части мира «{w}».'
    },
    new: {
      first_three_stars: ['Три звезды', 'Получить три звезды в деле кампании', 'Первое дело кампании на три звезды.'],
      streak_30: ['Тридцать дней подряд', 'Раскрывать дело дня тридцать дней подряд', 'Дело дня тридцать дней подряд.'],
      solved_10: ['Десять дел', 'Раскрыть десять дел', 'Раскрыто десять дел.'],
      solved_50: ['Пятьдесят дел', 'Раскрыть пятьдесят дел', 'Раскрыто пятьдесят дел.'],
      solved_100: ['Сто дел', 'Раскрыть сто дел', 'Раскрыто сто дел.'],
      solved_500: ['Пятьсот дел', 'Раскрыть пятьсот дел', 'Раскрыто пятьсот дел: гроссбух заполнен.'],
      first_master: ['Уровень «Мастер»', 'Раскрыть дело уровня «Мастер»', 'Раскрыто первое дело уровня «Мастер».']
    },
    boards: {
      points: ['Всего очков', 'Все очки за дела и задания на сегодня', 'очко', 'очков'],
      daily_time: ['Самое быстрое дело дня', 'Кто быстрее всех раскроет сегодняшнее дело? Новая таблица каждый день.']
    }
  },
  tr: {
    after: {
      first_case: 'İlk vakanı çözdün.', first_part: 'Kampanyanın bir bölümünü baştan sona bitirdin.',
      streak_3: 'Günlük vakayı üç gün üst üste oynadın.', streak_7: 'Bir hafta boyunca her gün oynadın.',
      case_of_week: 'Bir haftanın vakasını çözdün.', world: '{w} dünyasındaki bütün bölümleri bitirdin.'
    },
    new: {
      first_three_stars: ['Üç Yıldız', 'Bir kampanya vakasında üç yıldız kazan', 'Kampanyada ilk kez üç yıldız kazandın.'],
      streak_30: ['Otuz Gün Üst Üste', 'Günlük vakayı otuz gün üst üste oyna', 'Günlük vakayı otuz gün üst üste oynadın.'],
      solved_10: ['On Vaka', 'On vaka çöz', 'On vaka çözdün.'],
      solved_50: ['Elli Vaka', 'Elli vaka çöz', 'Elli vaka çözdün.'],
      solved_100: ['Yüz Vaka', 'Yüz vaka çöz', 'Yüz vaka çözdün.'],
      solved_500: ['Beş Yüz Vaka', 'Beş yüz vaka çöz', 'Beş yüz vaka çözdün: defter doldu.'],
      first_master: ['Usta Seviyesi', 'Usta seviyesinde bir vaka çöz', 'Usta seviyesindeki ilk vakanı çözdün.']
    },
    boards: {
      points: ['Toplam Puan', 'Vakalardan ve günlük görevlerden kazandığın bütün puanlar', 'puan', 'puan'],
      daily_time: ['En Hızlı Günlük Vaka', 'Bugünün vakasını en hızlı kim çözecek? Her gün yeni bir sıralama.']
    }
  },
  id: {
    after: {
      first_case: 'Kasus pertamamu terpecahkan.', first_part: 'Satu bagian kampanye selesai seluruhnya.',
      streak_3: 'Kasus harian dimainkan tiga hari berturut-turut.', streak_7: 'Bermain setiap hari selama seminggu.',
      case_of_week: 'Satu kasus mingguan terpecahkan.', world: 'Semua bagian {w} sudah selesai.'
    },
    new: {
      first_three_stars: ['Tiga Bintang', 'Raih tiga bintang di satu kasus kampanye', 'Kasus kampanye pertamamu dengan tiga bintang.'],
      streak_30: ['Tiga Puluh Hari Beruntun', 'Mainkan kasus harian tiga puluh hari berturut-turut', 'Kasus harian dimainkan tiga puluh hari berturut-turut.'],
      solved_10: ['Sepuluh Kasus', 'Pecahkan sepuluh kasus', 'Sepuluh kasus terpecahkan.'],
      solved_50: ['Lima Puluh Kasus', 'Pecahkan lima puluh kasus', 'Lima puluh kasus terpecahkan.'],
      solved_100: ['Seratus Kasus', 'Pecahkan seratus kasus', 'Seratus kasus terpecahkan.'],
      solved_500: ['Lima Ratus Kasus', 'Pecahkan lima ratus kasus', 'Lima ratus kasus terpecahkan: buku catatanmu penuh.'],
      first_master: ['Tingkat Ahli', 'Pecahkan satu kasus tingkat ahli', 'Kasus tingkat ahli pertamamu terpecahkan.']
    },
    boards: {
      points: ['Total Poin', 'Semua poin dari kasus dan misi harian', 'poin', 'poin'],
      daily_time: ['Kasus Harian Tercepat', 'Siapa yang paling cepat memecahkan kasus hari ini? Papan peringkat baru setiap hari.']
    }
  },
  vi: {
    after: {
      first_case: 'Bạn đã giải vụ án đầu tiên.', first_part: 'Bạn đã hoàn thành trọn một phần của chiến dịch.',
      streak_3: 'Bạn đã chơi vụ án hằng ngày ba ngày liên tiếp.', streak_7: 'Bạn đã chơi mỗi ngày suốt một tuần.',
      case_of_week: 'Bạn đã giải một vụ án hằng tuần.', world: 'Đã hoàn thành mọi phần của {w}.'
    },
    new: {
      first_three_stars: ['Ba sao', 'Đạt ba sao trong một vụ án của chiến dịch', 'Lần đầu đạt ba sao trong chiến dịch.'],
      streak_30: ['Ba mươi ngày liền', 'Chơi vụ án hằng ngày ba mươi ngày liên tiếp', 'Bạn đã chơi vụ án hằng ngày ba mươi ngày liên tiếp.'],
      solved_10: ['Mười vụ án', 'Giải mười vụ án', 'Bạn đã giải mười vụ án.'],
      solved_50: ['Năm mươi vụ án', 'Giải năm mươi vụ án', 'Bạn đã giải năm mươi vụ án.'],
      solved_100: ['Một trăm vụ án', 'Giải một trăm vụ án', 'Bạn đã giải một trăm vụ án.'],
      solved_500: ['Năm trăm vụ án', 'Giải năm trăm vụ án', 'Bạn đã giải năm trăm vụ án: sổ ghi chép đã đầy.'],
      first_master: ['Mức bậc thầy', 'Giải một vụ án ở mức bậc thầy', 'Bạn đã giải vụ án đầu tiên ở mức bậc thầy.']
    },
    boards: {
      points: ['Tổng điểm', 'Mọi điểm bạn kiếm được từ các vụ án và nhiệm vụ hằng ngày', 'điểm', 'điểm'],
      daily_time: ['Vụ án hằng ngày nhanh nhất', 'Ai giải vụ án hôm nay nhanh nhất? Bảng xếp hạng mới mỗi ngày.']
    }
  },
  ar: {
    after: {
      first_case: 'حللت قضيتك الأولى.', first_part: 'أنهيت جزءًا كاملًا من الحملة.',
      streak_3: 'لعبت القضية اليومية ثلاثة أيام متتالية.', streak_7: 'لعبت كل يوم طوال أسبوع.',
      case_of_week: 'حللت قضية أسبوع.', world: 'أنهيت كل أجزاء {w}.'
    },
    new: {
      first_three_stars: ['ثلاث نجمات', 'احصل على ثلاث نجمات في قضية من الحملة', 'أول قضية لك في الحملة بثلاث نجمات.'],
      streak_30: ['ثلاثون يومًا متتالية', 'العب القضية اليومية ثلاثين يومًا متتالية', 'لعبت القضية اليومية ثلاثين يومًا متتالية.'],
      solved_10: ['عشر قضايا', 'حُلّ عشر قضايا', 'حللت عشر قضايا.'],
      solved_50: ['خمسون قضية', 'حُلّ خمسين قضية', 'حللت خمسين قضية.'],
      solved_100: ['مئة قضية', 'حُلّ مئة قضية', 'حللت مئة قضية.'],
      solved_500: ['خمسمئة قضية', 'حُلّ خمسمئة قضية', 'حللت خمسمئة قضية: امتلأ السجل.'],
      first_master: ['مستوى الخبراء', 'حُلّ قضية من مستوى الخبراء', 'حللت أول قضية لك من مستوى الخبراء.']
    },
    boards: {
      points: ['مجموع النقاط', 'كل النقاط التي تكسبها من القضايا ومهام اليوم', 'نقطة', 'نقطة'],
      daily_time: ['أسرع حل للقضية اليومية', 'من يحل قضية اليوم أسرع من الجميع؟ لوحة صدارة جديدة كل يوم.']
    }
  },
  ur: {
    after: {
      first_case: 'آپ نے اپنا پہلا کیس حل کر لیا۔', first_part: 'آپ نے مہم کا ایک پورا باب مکمل کر لیا۔',
      streak_3: 'آپ نے روزانہ کیس لگاتار تین دن کھیلا۔', streak_7: 'آپ نے پورا ہفتہ ہر روز کھیلا۔',
      case_of_week: 'آپ نے ہفتے کا ایک کیس حل کر لیا۔', world: '{w} کے تمام ابواب مکمل ہو گئے۔'
    },
    new: {
      first_three_stars: ['تین ستارے', 'مہم کے کسی کیس میں تین ستارے حاصل کریں', 'مہم میں پہلی بار تین ستارے حاصل کیے۔'],
      streak_30: ['لگاتار تیس دن', 'روزانہ کیس لگاتار تیس دن کھیلیں', 'آپ نے روزانہ کیس لگاتار تیس دن کھیلا۔'],
      solved_10: ['دس کیس', 'دس کیس حل کریں', 'آپ نے دس کیس حل کر لیے۔'],
      solved_50: ['پچاس کیس', 'پچاس کیس حل کریں', 'آپ نے پچاس کیس حل کر لیے۔'],
      solved_100: ['سو کیس', 'سو کیس حل کریں', 'آپ نے سو کیس حل کر لیے۔'],
      solved_500: ['پانچ سو کیس', 'پانچ سو کیس حل کریں', 'آپ نے پانچ سو کیس حل کر لیے: رجسٹر بھر گیا۔'],
      first_master: ['ماہر درجہ', 'ماہر درجے کا ایک کیس حل کریں', 'آپ نے ماہر درجے کا پہلا کیس حل کر لیا۔']
    },
    boards: {
      points: ['کل پوائنٹس', 'کیسوں اور آج کے اہداف سے ملنے والے تمام پوائنٹس', 'پوائنٹ', 'پوائنٹس'],
      daily_time: ['تیز ترین روزانہ کیس', 'آج کا کیس سب سے جلدی کون حل کرتا ہے؟ ہر روز نئی درجہ بندی۔']
    }
  },
  hi: {
    after: {
      first_case: 'आपने अपना पहला केस सुलझा लिया।', first_part: 'अभियान का एक भाग शुरू से अंत तक पूरा हुआ।',
      streak_3: 'आपने रोज़ का केस लगातार तीन दिन खेला।', streak_7: 'आपने पूरे हफ़्ते हर दिन खेला।',
      case_of_week: 'आपने हफ़्ते का एक केस सुलझा लिया।', world: '{w} के सभी भाग पूरे हो गए।'
    },
    new: {
      first_three_stars: ['तीन सितारे', 'अभियान के किसी केस में तीन सितारे पाएँ', 'अभियान में पहली बार तीन सितारे मिले।'],
      streak_30: ['लगातार तीस दिन', 'रोज़ का केस लगातार तीस दिन खेलें', 'आपने रोज़ का केस लगातार तीस दिन खेला।'],
      solved_10: ['दस केस', 'दस केस सुलझाएँ', 'आपने दस केस सुलझा लिए।'],
      solved_50: ['पचास केस', 'पचास केस सुलझाएँ', 'आपने पचास केस सुलझा लिए।'],
      solved_100: ['सौ केस', 'सौ केस सुलझाएँ', 'आपने सौ केस सुलझा लिए।'],
      solved_500: ['पाँच सौ केस', 'पाँच सौ केस सुलझाएँ', 'आपने पाँच सौ केस सुलझा लिए: रजिस्टर भर गया।'],
      first_master: ['मास्टर लेवल', 'मास्टर लेवल का एक केस सुलझाएँ', 'आपने मास्टर लेवल का पहला केस सुलझा लिया।']
    },
    boards: {
      points: ['कुल अंक', 'केस और आज के टास्क से मिले सभी अंक', 'अंक', 'अंक'],
      daily_time: ['सबसे तेज़ रोज़ का केस', 'आज का केस सबसे पहले कौन सुलझाता है? हर दिन नई रैंकिंग।']
    }
  },
  mr: {
    after: {
      first_case: 'तुम्ही तुमचे पहिले प्रकरण सोडवले.', first_part: 'मोहिमेचा एक संपूर्ण भाग पूर्ण झाला.',
      streak_3: 'तुम्ही दैनिक प्रकरण सलग तीन दिवस खेळलात.', streak_7: 'तुम्ही पूर्ण आठवडा रोज खेळलात.',
      case_of_week: 'तुम्ही एक आठवड्याचे प्रकरण सोडवले.', world: '{w}: सर्व भाग पूर्ण झाले.'
    },
    new: {
      first_three_stars: ['तीन तारे', 'मोहिमेतील एका प्रकरणात तीन तारे मिळवा', 'मोहिमेत पहिल्यांदा तीन तारे मिळाले.'],
      streak_30: ['सलग तीस दिवस', 'दैनिक प्रकरण सलग तीस दिवस खेळा', 'तुम्ही दैनिक प्रकरण सलग तीस दिवस खेळलात.'],
      solved_10: ['दहा प्रकरणे', 'दहा प्रकरणे सोडवा', 'तुम्ही दहा प्रकरणे सोडवली.'],
      solved_50: ['पन्नास प्रकरणे', 'पन्नास प्रकरणे सोडवा', 'तुम्ही पन्नास प्रकरणे सोडवली.'],
      solved_100: ['शंभर प्रकरणे', 'शंभर प्रकरणे सोडवा', 'तुम्ही शंभर प्रकरणे सोडवली.'],
      solved_500: ['पाचशे प्रकरणे', 'पाचशे प्रकरणे सोडवा', 'तुम्ही पाचशे प्रकरणे सोडवली: नोंदवही भरली.'],
      first_master: ['निष्णात पातळी', 'निष्णात पातळीवरचे एक प्रकरण सोडवा', 'तुम्ही निष्णात पातळीवरचे पहिले प्रकरण सोडवले.']
    },
    boards: {
      points: ['एकूण गुण', 'प्रकरणे आणि आजच्या आव्हानांमधून मिळालेले सर्व गुण', 'गुण', 'गुण'],
      daily_time: ['सर्वात जलद दैनिक प्रकरण', 'आजचे प्रकरण सर्वात आधी कोण सोडवते? दररोज नवी क्रमवारी.']
    }
  },
  bn: {
    after: {
      first_case: 'আপনি প্রথম কেসের সমাধান করেছেন।', first_part: 'অভিযানের একটি পুরো পর্ব শেষ হয়েছে।',
      streak_3: 'আপনি টানা তিন দিন দৈনিক কেস খেলেছেন।', streak_7: 'আপনি পুরো এক সপ্তাহ প্রতিদিন খেলেছেন।',
      case_of_week: 'আপনি সপ্তাহের একটি কেসের সমাধান করেছেন।', world: '{w}: সব পর্ব শেষ।'
    },
    new: {
      first_three_stars: ['তিন তারা', 'অভিযানের কোনো কেসে তিন তারা পান', 'অভিযানে প্রথমবার তিন তারা পেয়েছেন।'],
      streak_30: ['টানা তিরিশ দিন', 'টানা তিরিশ দিন দৈনিক কেস খেলুন', 'আপনি টানা তিরিশ দিন দৈনিক কেস খেলেছেন।'],
      solved_10: ['দশটি কেস', 'দশটি কেসের সমাধান করুন', 'আপনি দশটি কেসের সমাধান করেছেন।'],
      solved_50: ['পঞ্চাশটি কেস', 'পঞ্চাশটি কেসের সমাধান করুন', 'আপনি পঞ্চাশটি কেসের সমাধান করেছেন।'],
      solved_100: ['একশোটি কেস', 'একশোটি কেসের সমাধান করুন', 'আপনি একশোটি কেসের সমাধান করেছেন।'],
      solved_500: ['পাঁচশোটি কেস', 'পাঁচশোটি কেসের সমাধান করুন', 'পাঁচশোটি কেসের সমাধান হয়েছে: খাতা ভরে গেছে।'],
      first_master: ['ওস্তাদ স্তর', 'ওস্তাদ স্তরের একটি কেসের সমাধান করুন', 'আপনি ওস্তাদ স্তরের প্রথম কেসের সমাধান করেছেন।']
    },
    boards: {
      points: ['মোট পয়েন্ট', 'কেস আর আজকের কাজ থেকে পাওয়া সব পয়েন্ট', 'পয়েন্ট', 'পয়েন্ট'],
      daily_time: ['দ্রুততম দৈনিক কেস', 'আজকের কেস সবার আগে কে মেলাবে? প্রতিদিন নতুন তালিকা।']
    }
  },
  te: {
    // in the app the opera and the film studio medal are both "తెర పడింది"; Game Center wants two names: the film gets the
    // "శుభం" card that closes a Telugu film
    names: { 'world.filmstudio': 'శుభం కార్డు పడింది' },
    after: {
      first_case: 'మీ మొదటి కేసును ఛేదించారు.', first_part: 'కథలో ఒక భాగాన్ని పూర్తిగా ముగించారు.',
      streak_3: 'రోజువారీ కేసును వరుసగా మూడు రోజులు ఆడారు.', streak_7: 'వారం మొత్తం ప్రతి రోజూ ఆడారు.',
      case_of_week: 'ఒక వారపు కేసును ఛేదించారు.', world: '{w}: అన్ని భాగాలూ పూర్తయ్యాయి.'
    },
    new: {
      first_three_stars: ['మూడు నక్షత్రాలు', 'కథలోని ఒక కేసులో మూడు నక్షత్రాలు సాధించండి', 'కథలో మొదటిసారి మూడు నక్షత్రాలు సాధించారు.'],
      streak_30: ['వరుసగా ముప్పై రోజులు', 'రోజువారీ కేసును వరుసగా ముప్పై రోజులు ఆడండి', 'రోజువారీ కేసును వరుసగా ముప్పై రోజులు ఆడారు.'],
      solved_10: ['పది కేసులు', 'పది కేసులు ఛేదించండి', 'పది కేసులు ఛేదించారు.'],
      solved_50: ['యాభై కేసులు', 'యాభై కేసులు ఛేదించండి', 'యాభై కేసులు ఛేదించారు.'],
      solved_100: ['వంద కేసులు', 'వంద కేసులు ఛేదించండి', 'వంద కేసులు ఛేదించారు.'],
      solved_500: ['ఐదు వందల కేసులు', 'ఐదు వందల కేసులు ఛేదించండి', 'ఐదు వందల కేసులు ఛేదించారు: పుస్తకం నిండిపోయింది.'],
      first_master: ['మాస్టర్ స్థాయి', 'మాస్టర్ స్థాయిలో ఒక కేసు ఛేదించండి', 'మాస్టర్ స్థాయిలో మొదటి కేసు ఛేదించారు.']
    },
    boards: {
      points: ['మొత్తం పాయింట్లు', 'కేసులు, ఈరోజు సవాళ్ల ద్వారా వచ్చిన అన్ని పాయింట్లు', 'పాయింటు', 'పాయింట్లు'],
      daily_time: ['వేగవంతమైన రోజువారీ కేసు', 'ఈరోజు కేసును అందరికంటే ముందు ఎవరు ఛేదిస్తారు? రోజూ కొత్త ర్యాంకింగ్.']
    }
  }
};
