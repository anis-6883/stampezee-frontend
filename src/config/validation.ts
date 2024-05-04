import * as Yup from 'yup';

export const contentFormValidation = Yup.object().shape({
  title: Yup.string().required('Required!'),
  content: Yup.string().required('Required!'),
  // status: Yup.string().oneOf(['0', '1']).optional()
});

export const dailyMannaFormValidation = Yup.object().shape({
  title: Yup.string().required('Required!'),
  date: Yup.string().required('Required!'),
});

export const prayerFormValidation = Yup.object().shape({
  email: Yup.string().email().required('Required!'),
  title: Yup.string().required('Required!'),
  description: Yup.string().required('Required!'),
  // status: Yup.string().oneOf(['0', '1']).optional()
});

export const userFormValidation = Yup.object().shape({
  email: Yup.string().email().required('Required!'),
  name: Yup.string().required('Required!'),
  password: Yup.string().required('Required!'),
});

export const languageFormValidation = Yup.object().shape({
  code: Yup.string().required('Required!'),
  name: Yup.string().required('Required!'),
  nameLocal: Yup.string().required('Required!'),
  script: Yup.string().optional(),
  scriptDirection: Yup.string().optional(),
});

export const vedioCategoryFormValidation = Yup.object().shape({
  name: Yup.string().required('Required!'),
});

export const vedioFormValidation = Yup.object().shape({
  channelId: Yup.string().required('Required!'),
});

export const songBookFormValidation = Yup.object().shape({
  name: Yup.string().required('Required!'),
  imageUrl: Yup.string().required('Required!'),
});

export const songFormValidation = Yup.object().shape({
  songTitle: Yup.string().required('Required!'),
  lyrics: Yup.string().required('Required!'),
});

export const posterFormValidation = Yup.object().shape({
  image: Yup.string().optional(),
  title: Yup.string().required('Required!'),
  description: Yup.string().required('Required!'),
});

export const posterCategoryFormValidation = Yup.object().shape({
  name: Yup.string().required('Required!'),
});
export const qaCategoryFormValidation = Yup.object().shape({
  name: Yup.string().required('Required!'),
});
