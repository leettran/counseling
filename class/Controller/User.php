<?php

namespace counseling\Controller;

require_once PHPWS_SOURCE_DIR.'mod/counseling/conf/defines.php';

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class User extends \phpws2\Http\Controller
{
    public function get(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);

        return $command->get($request);
    }

    public function post(\Canopy\Request $request)
    {
        $command = $this->routeCommand($request);

        return $command->post($request);
    }

    private function routeCommand($request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            $command = 'Checkin';
        }

        $className = 'counseling\Controller\User\\'.$command;
        if (!class_exists($className)) {
            throw new \Exception('Unknown command');
        }
        $commandObject = new $className($this->getModule());

        return $commandObject;
    }

    public function checkin()
    {
        if (COUNSELING_REACT_DEV) {
            $script[] = \counseling\Factory\React::development('User/Checkin/', 'script.js');
        } else {
            $script[] = \counseling\Factory\React::production('User/Checkin/', 'script.min.js');
        }
        $react = implode("\n", $script);
        \Layout::addStyle('counseling', 'User/style.css');

        $content = <<<EOF
<div id="Login"></div>
$react
EOF;

        return $content;
    }
}
