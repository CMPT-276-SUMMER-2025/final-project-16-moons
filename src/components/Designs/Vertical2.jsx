import meat from '../../assets/icons/meat.png'
import carrot from '../../assets/icons/carrot.png'
import apple from '../../assets/icons/apple.png'
import lines from '../../assets/lines.png'

export default function Vertical1() {
    return(
        <div className="grid grid-rows-4">
            <img src={meat} alt="Orange icon of a pear-shaped piece meat with a circle as a bone in the middle. Only the outline of the icon is orange, the icon's shape isn't filled."/>
            <img src={carrot} alt="Orange icon of a carrot with 4 ridges and 6 leaves. Only the outline of the icon is orange, the icon's shape isn't filled."/>
            <img src={apple} alt="Orange icon of an apple with a highlight mark near the top left, 1 leaf and 1 stem. Only the outline of the icon is orange, the icon's shape isn't filled."/>
            <img src={lines} alt="Orange cluster of straight lines with rounded edges. There are 3 lines stacked on top of each other on the left, and 3 lines on the right stacked in the same way. The left lines are positioned higher than the right side. On both sides, the longest line is on top, the shortest line is in the middle, and the mid-sized line is at the bottom."/>
        </div>
    );
}