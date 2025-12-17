import Level from './level'
import Logger from './logger';

const levels = [
    new Level(1, 'ALL', 'black'),
    new Level(2, 'TRACE', 'blue'),
    new Level(3, 'DEBUG', 'cyan'),
    new Level(4, 'INFO', 'green'),
    new Level(5, 'WARN', 'yellow'),
    new Level(6, 'ERROR', 'red'),
    new Level(7, 'FATAL', 'magenta'),
    new Level(8, 'OFF', 'grey'),
]

export default function (config) {
    let otherLevel = null;
    let logConfig = {};
    const log = {};

    log.use = function (level) {
        otherLevel = levels.find(item => item.level == level);
    }

    levels.forEach(item => {
        let method = item.toString().toLowerCase();
        log[method] = function (...msg) {
            if(! otherLevel) {
                let {appConfig} = config();
                logConfig = appConfig.log;
                otherLevel = levels.find(item => item.level == logConfig.level);
            }

            if(item.isLessThanOrEqualTo(otherLevel)) {
                let logger = new Logger(...msg);
                return logger.log(logConfig.name, item).upload(logConfig.name, item, logConfig.upload);
            }
        }
    })
    return log;
}
