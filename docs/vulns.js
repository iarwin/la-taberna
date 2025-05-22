const allVulnerabilities = [
//vulnerabilidades web

    "xss",
    "sqli",
    "lfi",
    "rfi",
    "idor",
    "csrf",
    "ssrf",
    "rce",
    "file-upload",
    "ssti",
    "open-redirect",

//autenticacion / credenciales

    "default-creds",
    "weak-password",
    "password-reuse",
    "credential-dump",
    "hardcoded-creds",

//escalada de privilegios (linux / windows)

    "suid",
    "sudo-misconfig",
    "capabilities",
    "cronjobs",
    "path-hijack",
    "kernel-exploit",
    "unquoted-service-path",
    "seimpersonate",
    "token-manipulation",
    "alwaysinstallelevated",

//active directory

    "as-rep-roasting",
    "kerberoasting",
    "llmnr-poisoning",
    "unconstrained-delegation",
    "rBCD",
    "gpp-password",
    "dcsync",
    "golden-ticket",
    "bloodhound-needed",

//malconfiguraciones generales

    "file-permissions",
    "docker-misconfig",
    "git-leak",
    "env-leak",
    "insecure-api",
    "exposed-panel",

//exploits conocidos

    "cve"


];
