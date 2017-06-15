casper.test.begin('Knowledge Base Search', (test) => {
  casper.start(casper.server_url, () => {
    test.assertTitle('Knowledge Base Search', 'Title is "Knowledge Base Search"');
  });

  casper.run(() => {
    test.done();
  });
});
