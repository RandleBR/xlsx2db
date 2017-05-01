**free

// xlsx2db - transform XLSX spreadsheet to database file

ctl-opt dftactgrp(*no) main(main);

dcl-pr main extpgm('XLSX2DB');
  config    char(256) const;
  xlsxName  char(256) const options(*nopass);
end-pr;

dcl-pr cmdExec extpgm('QCMDEXC');
  cmd char(1024) const;
  cmdlength packed(15 : 5) const;
end-pr;

dcl-proc main;
dcl-pi *n;
  config    char(256) const;
  xlsxName  char(256) const options(*nopass);
end-pi;

  dcl-s cmd char(1024);

  cmd = 'ADDENVVAR QIBM_MULTI_THREADED value(Y) replace(*yes)';
  cmdExec(cmd:%size(cmd));

  cmd = 'QSH CMD(''cd /home/brianr/xlsx2db && '+
        'node '+
        'index-10 ' +
        '--config ' + %trim(config);
  if %parms=2;
    cmd = %trim(cmd) + ' --xlsx ' + %trim(xlsxName);
  endif;

  cmd = %trim(cmd) + ''')';
  cmdExec(cmd:%size(cmd));

  *inlr = *on;

end-proc;         
