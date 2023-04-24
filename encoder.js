const CRLF = '\r\n';

module.exports = function encodeCommand(args) {
  const kek = [];
  const split = args.split(' ');

  kek.push('*' + split.length + CRLF);
  for (const arg of split) {
    kek.push('$' + arg.length + CRLF + arg + CRLF);
  }

  const hmm = kek.join('');
  return hmm;
};
