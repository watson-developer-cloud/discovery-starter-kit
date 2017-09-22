casper.test.begin('Knowledge Base Search', (test) => {
  casper.start(casper.server_url, () => {
    test.assertTitle('Knowledge Base Search', 'Title is "Knowledge Base Search"');
  });

  casper.then(() => {
    casper.waitForSelector('.question_bar--button',
      () => {
        casper.capture(`${casper.screenshots_dir}/questions_exist.png`);
        test.assertElementCount(
          '.question_bar--button',
          4,
          '4 Preset Questions shown on initial load',
        );
        casper.click('.question_bar--button:first-child');
        casper.capture(`${casper.screenshots_dir}/search_clicked.png`);

        casper.waitForSelector('.result_container--div',
          () => {
            // wait for transition
            casper.wait(5000, () => {
              casper.capture(`${casper.screenshots_dir}/results_exist.png`);
              test.assertElementCount(
                '.result_container--div',
                6,
                '6 Passage results exist when a search is clicked');
            });
          },
          () => {
            casper.capture(`${casper.screenshots_dir}/results_failure.png`);
            test.fail();
          },
        );
      },
      () => {
        casper.capture(`${casper.screenshots_dir}/questions_failure.png`);
        test.fail();
      },
    );
  });

  casper.run(() => {
    test.done();
  });
});
