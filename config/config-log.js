'use strict';

const winston = require('winston');
require('winston-daily-rotate-file');

// Logger configuration
var getConfig = function (module) {
    var path = module.filename.split('/').slice(-2).join('/');
    return {
        transports: [
            new winston.transports.Console({
                level: 'info'
            }),
            new winston.transports.DailyRotateFile({
                level: 'warn',
                filename: 'server-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '100m',
                maxFiles: '14d',
                dirname: 'logs'
            })
        ],
        format: winston.format.combine(
            winston.format.label({
                label: path
            }),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf(function (info) {
                return `${info.timestamp} - ${info.label}:[${info.level}]: ${info.message}`;
            })
        )
    };
}

module.exports = getConfig;