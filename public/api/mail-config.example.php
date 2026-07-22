<?php

// DEPRECATED: This file is a fallback. The ContactController now reads SMTP
// settings from environment variables (MAIL_SMTP_*) defined in backend/.env.
//
// Only used if MAIL_SMTP_HOST is not set in env. If you must use this file,
// copy it to mail-config.php and fill in real mailbox credentials.
// mail-config.php is gitignored and must never be committed.

return [
    'smtp_host'    => 'mail.sstechnologies.pk',
    'smtp_port'    => 465,
    'smtp_secure'  => 'ssl',
    'smtp_user'    => 'info@sstechnologies.pk',
    'smtp_pass'    => 'CHANGE_ME_cpanel_mailbox_password',
    'smtp_timeout' => 20,

    'from_email'   => 'info@sstechnologies.pk',
    'from_name'    => 'Swift Sign Electronics',
    'to_email'     => 'info@sstechnologies.pk',
    'to_name'      => 'Swift Sign Electronics',
];
