export const TEMPLATES = [
  { title: 'Написать 500 строк кода',       desc: 'Включая комментарии и рефакторинг',        difficulty: 'hard'   },
  { title: 'Не открывать YouTube до 18:00', desc: 'Никаких коротких видео, рилсов, шортсов',   difficulty: 'medium' },
  { title: 'Закрыть 3 задачи из backlog',   desc: 'Полноценно, с тестами и PR',               difficulty: 'medium' },
  { title: 'Пробежать 5 км',                desc: 'Без остановок, любым темпом',               difficulty: 'easy'   },
  { title: 'Прочитать 30 страниц книги',    desc: 'Нон-фикшн или профессиональная литература', difficulty: 'easy'   },
  { title: 'Не трогать телефон 4 часа',     desc: 'Только работа, никаких уведомлений',        difficulty: 'hard'   },
]

export const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   xp: 10, color: '#00c851' },
  { id: 'medium', label: 'Medium', xp: 25, color: '#ff9500' },
  { id: 'hard',   label: 'Hard',   xp: 50, color: '#ff3d3d' },
]

export const TOTAL_STEPS = 4

export const URGENCY_COLORS = {
  green:  '#00c851',
  yellow: '#ff9500',
  red:    '#ff3d3d',
}
