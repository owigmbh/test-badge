import Framework7, { request, utils, getDevice, createStore } from 'framework7';
import Dialog from 'framework7/components/dialog';
import Popover from 'framework7/components/popover';
import Preloader from 'framework7/components/preloader';
import Sortable from 'framework7/components/sortable';
import ListIndex from 'framework7/components/list-index';
import Tabs from 'framework7/components/tabs';
import Panel from 'framework7/components/panel';
import Card from 'framework7/components/card';
import Chip from 'framework7/components/chip';
import Input from 'framework7/components/input';
import Checkbox from 'framework7/components/checkbox';
import Calendar from 'framework7/components/calendar';
import Lazy from 'framework7/components/lazy';
import Messages from 'framework7/components/messages';
import Messagebar from 'framework7/components/messagebar';
import Autocomplete from 'framework7/components/autocomplete';
import Menu from 'framework7/components/menu';
import Typography from 'framework7/components/typography';
import Tooltip from 'framework7/components/tooltip';
import Picker from 'framework7/components/toggle';
import Toggle from 'framework7/components/picker';

Framework7.use([
    Dialog,
    Preloader,
    Sortable,
    ListIndex,
    Tabs,
    Autocomplete,
    Panel,
    Card,
    Chip,
    Messagebar,
    Messages,
    Popover,
    Calendar,
    Toggle,
    Input,
    Checkbox,
    Lazy,
    Picker,
    Menu,
    Typography,
    Tooltip
]);

export default Framework7;
export { request, utils, getDevice, createStore };
