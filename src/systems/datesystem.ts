module CityGame
{
  export module Systems
  {
    interface IDateObj
    {
      year: number;
      month: number;
      day: number;
    }

    export class DateSystem extends System
    {
      year: number;
      month: number;
      day: number;

      dateElem: HTMLElement;

      onDayChange: { (): any; }[];
      onMonthChange: { (): any; }[];
      onYearChange: { (): any; }[];

      constructor(activationRate: number, systemsManager: SystemsManager,
        dateElem: HTMLElement, startDate?: IDateObj)
      {
        super(activationRate, systemsManager.tickNumber);
        this.year  = startDate ? startDate.year  : 2000;
        this.month = startDate ? startDate.month : 1;
        this.day   = startDate ? startDate.day   : 1;

        this.dateElem = dateElem;

        this.updateDate();
      }
      activate()
      {
        this.incrementDate();
      }
      incrementDate()
      {
        this.day++;

        this.fireCallbacks(this.onDayChange, this.day);

        this.calculateDate();
      }
      calculateDate()
      {
        if (this.day > 30)
        {
          this.day -= 30;
          this.month++;

          this.fireCallbacks(this.onMonthChange, this.month);
        }
        if (this.month > 12)
        {
          this.month -= 12;
          this.year++;
          
          this.fireCallbacks(this.onYearChange, this.year);
        }
        if (this.day > 30 || this.month > 12)
        {
          this.calculateDate();
        }
        else
        {
          this.updateDate();
        }
      }

      fireCallbacks(targets: { (): any; }[], date: number)
      {
        if (!targets) return;
        for (var i = 0; i < targets.length; i++)
        {
          targets[i].call(date);
        }
      }

      getDate() :IDateObj
      {
        var dateObj =
        {
          year: this.year,
          month: this.month,
          day: this.day
        };
        return dateObj;
      }
      setDate(newDate: IDateObj)
      {
        this.year = newDate.year;
        this.month = newDate.month;
        this.day = newDate.day;

        this.updateDate();
      }
      toString()
      {
        return "" + this.day + "." + this.month + "." + this.year;
      }
      updateDate()
      {
        this.dateElem.innerHTML = this.toString();
      }
    }
  }
}
