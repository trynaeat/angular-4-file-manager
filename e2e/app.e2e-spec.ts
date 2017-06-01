import { MeanAppPage } from './app.po';

describe('mean-app App', () => {
  let page: MeanAppPage;

  beforeEach(() => {
    page = new MeanAppPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
