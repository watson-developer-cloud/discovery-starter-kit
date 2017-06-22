casper.test.begin('Knowledge Base Search', (test) => {
  casper.start(casper.server_url, () => {
    test.assertTitle('Knowledge Base Search', 'Title is "Knowledge Base Search"');
  });

  casper.then(() => {
    casper.click('.clickable-tab:first-child');
    casper.capture(`${casper.screenshots_dir}/search_clicked.png`);

    casper.waitForSelector('.result_box--div',
      () => {
        // wait for transition
        casper.wait(5000, () => {
          casper.capture(`${casper.screenshots_dir}/results_exist.png`);
          test.assertElementCount('.result_box--div', 2, '2 Results exist');
        });
      },
      () => {
        casper.capture(`${casper.screenshots_dir}/results_failure.png`);
        test.fail();
      }
    );
  });

  casper.run(() => {
    test.done();
  });
});
