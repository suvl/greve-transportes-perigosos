<?php
declare(strict_types=1);

namespace App;

use Illuminate\Database\Eloquent\Model;

class FuelStation extends Model
{
    protected $table = 'fuel_stations';

    protected $guarded = ['id'];

    public function getStringAttribute()
    {
        return "{$this->name} ({$this->brand}) ID #{$this->id}";
    }

    public function scopeEmpty($query)
    {
        return $query->whereRaw('((sell_gasoline = TRUE and has_gasoline = false) || sell_gasoline = false) AND ((sell_diesel = TRUE and has_diesel = false) || sell_diesel = false) AND ((sell_lpg = TRUE and has_lpg = false) || sell_lpg = false)');
    }

    public function scopePartial($query)
    {
        return $query->whereRaw('(!(((sell_gasoline = TRUE and has_gasoline = false) || sell_gasoline = false) AND ((sell_diesel = TRUE and has_diesel = false) || sell_diesel = false) AND ((sell_lpg = TRUE and has_lpg = false) || sell_lpg = false)) AND (((sell_gasoline = TRUE AND has_gasoline = TRUE) || sell_gasoline = false) || ((sell_diesel = TRUE AND has_diesel = TRUE) || sell_diesel = false) || ((sell_lpg = TRUE AND has_lpg = TRUE) || sell_lpg = false)) AND (!((sell_gasoline = TRUE AND has_gasoline = TRUE) || sell_gasoline = false) AND ((sell_diesel = TRUE AND has_diesel = TRUE) || sell_diesel = false) AND ((sell_lpg = TRUE AND has_lpg = TRUE) || sell_lpg = false)))');
    }

    public function scopeWithAll($query)
    {
        return $query->gasoline()->diesel()->LPG();
    }

    public function scopeGasoline($query)
    {
        return $query->where([['sell_gasoline', '=', true], ['has_gasoline','=',true]])->orWhere([['sell_gasoline', '=', false]]);
    }

    public function scopeDiesel($query)
    {
        return $query->where([['sell_diesel', '=', true], ['has_diesel','=',true]])->orWhere([['sell_diesel', '=', false]]);
    }

    public function scopeLPG($query)
    {
        return $query->where([['sell_lpg', '=', true], ['has_lpg','=',true]])->orWhere([['sell_lpg', '=', false]]);
    }

    public function scopeNoGasoline($query)
    {
        return $query->where([['sell_gasoline', '=', true], ['has_gasoline','=',false]]);
    }

    public function scopeNoDiesel($query)
    {
        return $query->where([['sell_diesel', '=', true], ['has_diesel','=',false]]);
    }

    public function scopeNoLPG($query)
    {
        return $query->where([['sell_lpg', '=', true], ['has_lpg','=',false]]);
    }

    public function scopeDistricts($query)
    {
        return $query->selectRaw('district')->groupBy('district')->get()->pluck('district');
    }

    public function scopeCounties($query, $district)
    {
        return $query->selectRaw('county')->where('district', '=', $district)->groupBy('county')->get()->pluck('county');
    }

    public function scopeSellGasoline($query)
    {
        return $query->where([['sell_gasoline', '=', true]]);
    }

    public function scopeSellDiesel($query)
    {
        return $query->where([['sell_diesel', '=', true],]);
    }

    public function scopeSellLPG($query)
    {
        return $query->where([['sell_lpg', '=', true]]);
    }
}
