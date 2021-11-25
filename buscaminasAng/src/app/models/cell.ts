export interface Cell{
    bomb: boolean;
    checked: boolean;
    flag: boolean;
    amountBombs: number;
    id: number;
    innerMsg: string;
    questionMark: boolean;
}