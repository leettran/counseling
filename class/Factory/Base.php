<?php

namespace counseling\Factory;

/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class Base extends \phpws2\ResourceFactory
{
    public static function pullPostString($varname)
    {
        return trim(strip_tags(filter_input(INPUT_POST, $varname, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES)));
    }

    public static function pullPostCheck($varname)
    {
        return filter_input(INPUT_POST, $varname, FILTER_VALIDATE_BOOLEAN);
    }

    public static function pullPostInteger($varname)
    {
        return filter_input(INPUT_POST, $varname, FILTER_SANITIZE_NUMBER_INT);
    }

    public static function pullGetInteger($varname)
    {
        return filter_input(INPUT_GET, $varname, FILTER_SANITIZE_NUMBER_INT);
    }

    public static function categoryIcons()
    {
        $obj = new \stdClass();
        $obj->{CC_CATEGORY_OTHER} = CC_CATEGORY_OTHER_ICON;
        $obj->{CC_CATEGORY_WALKIN} = CC_CATEGORY_WALKIN_ICON;
        $obj->{CC_CATEGORY_APPOINTMENT} = CC_CATEGORY_APPOINTMENT_ICON;
        $obj->{CC_CATEGORY_GROUP} = CC_CATEGORY_GROUP_ICON;

        return $obj;
    }

    public static function getTodayStartTime()
    {
        return mktime(0, 0, 0, date('n'), date('j'), date('Y'));
    }

    public static function getTodayEndTime()
    {
        return mktime(23, 59, 59, date('n'), date('j'), date('Y'));
    }

    public static function getLastSorting($table_name)
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable($table_name, null, false);
        $col = $tbl->getField('sorting');
        $exp = new \phpws2\Database\Expression("max($col)", 'max');
        $db->addExpression($exp);
        $result = $db->selectOneRow();
        if (empty($result)) {
            return 0;
        } else {
            return $result['max'];
        }
    }
}
