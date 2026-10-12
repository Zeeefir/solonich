export function formatUnit(value, lang) {
  if (lang !== 'EN') return value;
  return value.replace('ккал', 'kcal').replace('кДж', 'kJ').replace('г', 'g').replace(',', '.');
}

export function localizeError(message, lang) {
  if (lang === 'EN') return message;
  const errors = {
    'Enter a valid email address': ['Введите корректный email', 'Дұрыс email енгізіңіз'],
    'Name must contain 1–80 characters': ['Имя должно содержать от 1 до 80 символов', 'Аты 1–80 таңбадан тұруы керек'],
    'Password must contain 10–128 characters': ['Пароль должен содержать от 10 до 128 символов', 'Құпиясөз 10–128 таңбадан тұруы керек'],
    'This email is already registered': ['Этот email уже зарегистрирован', 'Бұл email бұрын тіркелген'],
    'Incorrect email or password': ['Неверный email или пароль', 'Email немесе құпиясөз қате'],
    'Invalid setup code': ['Неверный код настройки', 'Баптау коды қате'],
    'Administrator already configured': ['Администратор уже создан', 'Әкімші бұрын құрылған'],
    'Too many attempts. Please wait a minute.': ['Слишком много попыток. Подождите минуту.', 'Әрекет тым көп. Бір минут күтіңіз.'],
    'Administrator access required': ['Нужны права администратора', 'Әкімші құқықтары қажет'],
    'Please sign in': ['Войдите в профиль', 'Жеке кабинетке кіріңіз'],
    'Product not found': ['Товар не найден', 'Өнім табылмады'],
    'Use a local image path or HTTPS image URL': ['Укажите локальный путь к фото или HTTPS-ссылку', 'Жергілікті фото жолын немесе HTTPS-сілтемені көрсетіңіз'],
    'Server error': ['Ошибка сервера', 'Сервер қатесі'],
    'Failed to fetch': ['Нет связи с сервером базы', 'Дерекқор серверімен байланыс жоқ'],
  };
  if (message.startsWith('Complete the field:')) return `${lang === 'KZ' ? 'Өрісті толтырыңыз' : 'Заполните поле'}: ${message.split(': ')[1]}`;
  return errors[message]?.[lang === 'KZ' ? 1 : 0] || (lang === 'KZ' ? 'Әрекет орындалмады. Қайталап көріңіз.' : 'Не удалось выполнить действие. Попробуйте ещё раз.');
}
