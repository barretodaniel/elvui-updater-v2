import { ElvuiUpdaterV2Page } from './app.po';

describe('elvui-updater-v2 App', () => {
  let page: ElvuiUpdaterV2Page;

  beforeEach(() => {
    page = new ElvuiUpdaterV2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
